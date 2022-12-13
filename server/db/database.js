const {MongoClient,ObjectId} = require("mongodb");
const {BSONTypeError} = require("bson");
const hashPassword = require("../utils/hashPassword");


const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);
const db = client.db("social-media-app-database");

const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");


async function isValidID(id){
    return ObjectId.isValid(id);
}


/**
 * this function gets a user from the database that matches the given email.
 * 
 * @param {string} email required.
 * @param {Object} projection optionnal: choose which column in the database to get, will return everything if left empty.
 * @returns database return user OR {error}.
 * 
 * @example 
 * email = "example@gmail.com"
 * project = {username:1,password:0,description:1}
 */
async function getUserByEmail(email,projection={}){
    try {
        let output = await usersCollection.findOne({email},{projection});
        return output;
    } catch (error) {
        console.error("\x1b[31m" + "error from database > getUserByEmail: \n"+ "\x1b[0m" + error.message);
        return {error};
    }
}

/**
 * this function gets all the users that have similar names from the database.
 * 
 * @param {string} username required.
 * @returns object {status : 200,users : [data]} OR {status : 500}.
 */
async function getUsersByName(username){
    try {
        let users = await usersCollection.find({username: {$regex: username, $options: 'i'}}).project({_id:1,username:1}).toArray();
        return {status:200,users};
    } catch (error) {
        console.error("\x1b[31m" + "error from database > getUsersByName: \n"+ "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * gets the profile that much a specific user id.
 * @param {String} id
 * @return  status code OR object that contains username and details
 */
async function getUserProfileById(id){
    try {
        let output = await usersCollection.findOne({_id:new ObjectId(id)},{projection:{_id:1,username:1,details:1}});
        if (output === null) return {status:404};
        return output;
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > getUserProfileById: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * Gets all the user friends data
 * for old users who dont have the friends objects it will return a friends object that looks
 * like that the user have no friends instead of undefined
 * @param {Required} id 
 */
async function getUserFriendsDataById(id){
    try {
        let output = await usersCollection.findOne({_id:new ObjectId(id)},{projection:{friends:1,_id:0}});
        if (output === null) return {status:404};
        output = output["friends"];
        if (output == undefined){
            output = {ids:{},total:0,received_invitation:{},sent_invitation:{}};
        }
        return output;
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400,error:"bad id"};
        }
        console.error("\x1b[31m" + "error from database > getUserFriendsDataById: \n"+ "\x1b[0m" + error.message);
        return {status:502,error:"server error"};
    }
}

/**
 * Checks if the given user credentions are right by hashing the password then compares it to the hash stored in the database.
 * 
 * @param {*} email required.
 * @param {*} password required.
 * @returns status code (200,404,500)
 */
async function userSignin(email,password){
    try {
        //get user data
        let user = await getUserByEmail(email,{hashSalt:1,hashedPassword:1,username:1});
        if (user === null){
            //user doesnt exists
            return {status:404};
        }
        //verify the given password
        let hashSalt = user.hashSalt;
        let hashedPassword = user.hashedPassword;
        let unverifiedHashedPassword = hashPassword.hashPassword(password,hashSalt);

        if (hashedPassword === unverifiedHashedPassword){
            //correct password
            let userID = user._id.toString();
            let username = user.username;
            return {status:200,userID,username};
        }
        //wrong password
        return {status:404};

    } catch (error) {
        console.error("\x1b[31m" + "error from database > userSignin: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * verify if the given password of a specific user.
 * 
 * @param {String} userID 
 * @param {String} password 
 * @returns status code (200/403/404/500)
 */
async function verifyUserPassword(userID,password){
    try {
        //get user data
        let filter ={
           _id: new ObjectId(userID)
        }
        let projection = {
            hashSalt:1,
            hashedPassword:1
        }
        let user = await usersCollection.findOne(filter,{projection});
        if (user === null){
            //user doesnt exists
            return {status:404};
        }
        //verify the given password
        let hashSalt = user.hashSalt;
        let hashedPassword = user.hashedPassword;
        let unverifiedHashedPassword = hashPassword.hashPassword(password,hashSalt);

        if (hashedPassword === unverifiedHashedPassword){
            //correct password
            return {status:200};
        }
        //wrong password
        return {status:403};
    } catch (error) {
        console.error("\x1b[31m" + "error from database > verifyUserPassword: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * Add a user to the database.
 * 
 * @param {string} username required.
 * @param {string} email required.
 * @param {string} hashedPassword required.
 * @param {string} hashSalt required: salt used to hash the password.
 * @returns status code (201,409,500)
 */
async function userSignup(username,email,hashedPassword,hashSalt){
    try {
        //check if the user exists already
        let userExist = await getUserByEmail(email);
        if (userExist === null){
            //user doesnt exist
            //save his data
            let details = {aboutMe:""};
            let timeStamp = Math.floor(Date.now() / 1000);
            let friends = {ids:{},total:0,received_invitation:{},sent_invitation:{}};
            let userID = (await usersCollection.insertOne({username,email,hashedPassword,hashSalt,details,friends,timeStamp})).insertedId.toString();
            return {status:201,userID};
        }else{
            //throw an error if the get user has thrown an error
            if (userExist.error !== undefined) return {status:500};
            //user already exist
            return {status:409};
        }
    } catch (error) {
        console.error("\x1b[31m" + "error from database > userSignup: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * updates the Details object saved with the given userID.
 * @param {String} userID 
 * @param {String} aboutMe
 * @returns status code (200/400/502)
 */
async function updateProfileDetails(userID,aboutMe){
    try {
        let _id = new ObjectId(userID);
        const filter = { _id };
        const updateDoc = {
            $set: {
                "details.aboutMe":aboutMe
            },
        };
        await usersCollection.updateOne(filter,updateDoc);
        return {status:200};
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > updateProfileDetails: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * create a new posts that will be saved with a userID.
 * @param {String} userID 
 * @param {String} text 
 * @returns status code (201/400/502)
 */
 async function createPost(userID,text){
    try {
        let timeStamp = Math.floor(Date.now() / 1000);
        await postsCollection.insertOne({text,userID,timeStamp});
        return {status:201}
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > createPost: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * create a new posts that will be saved with a userID.
 * @param {String} userID 
 * @param {String} username 
 * @returns status code (200/400/502)
 */
 async function updateUsername(userID,username){
    try {
        let _id = new ObjectId(userID);
        const filter = { _id };
        const updateDoc = {
            $set: {
                "username":username
            },
        };
        let result = await usersCollection.updateOne(filter,updateDoc);
        return {status:200,"modifiedCount":result.modifiedCount};
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > updateUsername: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * 
 * @param {String} userID 
 * @param {String} hashedPassword 
 * @param {String} hashSalt String used to hash a password into the given hashedPassword.
 * @returns status code (200/400/500)
 */
async function updateUserPassword(userID,hashedPassword,hashSalt){
    try {
        //get user data
        const filter = { _id: new ObjectId(userID) };
        const updateDoc = {
            $set: {
                hashedPassword,
                hashSalt
            },
        };
        await usersCollection.updateOne(filter,updateDoc);
        return {status:200};
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > updateUserPassword: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * get all the posts of a specific user
 * @param {String} userID 
 * @param {String} text 
 * @returns status code (201/400/502)
 */
 async function getPosts(userID){
    try {
        let output = await postsCollection.find({userID}).sort({ timeStamp: -1}).toArray();
        return {status:200,output};
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > createPost: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * updates the friends object inside a user document in the database
 * 
 * @param {Required} userID 
 * @param {Required} newFriends 
 */
async function updateFriendsObject(userID,newFriends){
    try {
        let _id = new ObjectId(userID);
        const filter = { _id };
        const updateDoc = {
            $set: {
                "friends":newFriends
            },
        };
        await usersCollection.updateOne(filter,updateDoc);
        return {status:200};
    } catch (error) {
        if(error instanceof BSONTypeError){
            return {status:400};
        }
        console.error("\x1b[31m" + "error from database > updateFriendsObject: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * adds an invitation request to the target user and adds a sent invitation to the current user
 * 
 * @param {Required} currentUserID the user who has sent an invitation
 * @param {Required} targetID the user who will receiver the invitation
 * @returns 
 */
async function sendInvitationRequest(currentUserID,targetID){
    try {
        //get the current user friends object data
        let currentUserFriends = await getUserFriendsDataById(currentUserID);
        if (currentUserFriends.status){
            return {status:currentUserFriends.status}
        }
        //get the target user friends object data
        let targetUserFriends = await getUserFriendsDataById(targetID);
        if (targetUserFriends.status){
            return {status:targetUserFriends.status}
        }
        //check if the they are already friends if yes then return a status code
        if (currentUserFriends.ids[targetID]){
            return {status:400,message:"the user is already a friend"}
        }

        //check if one of them has already sent an invitation
        if (currentUserFriends.sent_invitation[targetID]){
            return {status:400,message:"already sent an invitation"}
        }
        if (currentUserFriends.received_invitation[targetID]){
            return {status:400,message:"the target user already sent an invitation"}
        }

        //add the targetID to the user sent_invitation array
        currentUserFriends.sent_invitation[targetID] = 1;
        //add the current userID to the target received_invitation array
        targetUserFriends.received_invitation[currentUserID] = 1;

        //update the database
        await updateFriendsObject(currentUserID,currentUserFriends);
        await updateFriendsObject(targetID,targetUserFriends);
        
        //send a status code of 200 if everything went fine
        return {status:200};
    } catch (error) {
        console.error("\x1b[31m" + "error from database > sendInvitationRequest: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }
}

/**
 * accepts the invitation request of a user
 * 
 * @param {Required} currentUserID 
 * @param {Required} acceptedUserID 
 */
async function acceptInvitation(currentUserID,acceptedUserID){
    try {
        //get the received invitations of the current user
        let currentUser_Friends = await getUserFriendsDataById(currentUserID);

        //check if both users are friends if so then return a status code
        if (currentUser_Friends.ids[acceptedUserID]) return {status:400,message:"both users are already friends"};
        
        //check if the accepted user id is in the received_invitation of the current user
        let received_invitation = currentUser_Friends.received_invitation;
        if (received_invitation == undefined) return {status:currentUser_Friends.status}
        if (received_invitation[acceptedUserID] == undefined) return {status:404,message:"invitation not found"};
        
        //update the friends object of the current user
        delete currentUser_Friends.received_invitation[acceptedUserID];
        currentUser_Friends.ids[acceptedUserID] = 1;
        currentUser_Friends.total++;
        if (currentUser_Friends.sent_invitation[acceptedUserID]) {
            delete currentUser_Friends.sent_invitation[acceptedUserID];
        }

        //update the friends object of the accepted user
        let acceptedUser_Friends = await getUserFriendsDataById(acceptedUserID);
        acceptedUser_Friends.ids[currentUserID] = 1;
        delete acceptedUser_Friends.sent_invitation[currentUserID];
        acceptedUser_Friends.total++;
        if (acceptedUser_Friends.received_invitation[currentUserID]) {
            delete acceptedUser_Friends.received_invitation[currentUserID];
        }

        //update Objects in the database
        let currentUser_requestStatus = await updateFriendsObject(currentUserID,currentUser_Friends);
        if (currentUser_requestStatus.status !== 200){
            return {status:currentUser_requestStatus.status};
        }
        let acceptedUser_requestStatus = await updateFriendsObject(acceptedUserID,acceptedUser_Friends);
        if (acceptedUser_requestStatus.status !== 200){
            return {status:acceptedUser_requestStatus.status};
        }

        //send back a status code
        return {status:200};

    } catch (error) {
        console.error("\x1b[31m" + "error from database > acceptInvitation: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }    
}

/**
 * decline the invitation request of a user
 * 
 * @param {Required} currentUserID 
 * @param {Required} declinedUserID 
 */
 async function declineInvitation(currentUserID,declinedUserID){
    try {
        //get the received invitations of the current user
        let currentUser_Friends = await getUserFriendsDataById(currentUserID);

        //check if both users are friends if so then return a status code
        if (currentUser_Friends.ids[declinedUserID]) return {status:400,message:"both users are already friends"};
        
        //check if the accepted user id is in the received_invitation of the current user
        let received_invitation = currentUser_Friends.received_invitation;
        if (received_invitation == undefined) return {status:currentUser_Friends.status}
        if (received_invitation[declinedUserID] == undefined) return {status:404,message:"invitation not found"};

        //update the friends object of the current user
        delete currentUser_Friends.received_invitation[declinedUserID];

        //update Objects in the database
        let currentUser_requestStatus = await updateFriendsObject(currentUserID,currentUser_Friends);
        if (currentUser_requestStatus.status !== 200){
            return {status:currentUser_requestStatus.status};
        }

        //send back a status code
        return {status:200};

    } catch (error) {
        console.error("\x1b[31m" + "error from database > acceptInvitation: \n"+ "\x1b[0m" + error.message);
        return {status:502};
    }    
}

module.exports = {isValidID,
                userSignup,userSignin,getUserProfileById,getUserFriendsDataById,updateProfileDetails,
                createPost,getPosts,updateUsername,updateUserPassword,verifyUserPassword,
                getUsersByName,
                sendInvitationRequest,acceptInvitation,declineInvitation};