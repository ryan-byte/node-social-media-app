const {MongoClient,ObjectId} = require("mongodb");
const {BSONTypeError} = require("bson");
const hashPassword = require("../utils/hashPassword");


const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);
const db = client.db("social-media-app-database");

const usersCollection = db.collection("users");
const postsCollection = db.collection("posts");

/**
 * this function gets a user from the database that matches the given email.
 * 
 * @param {string} email required.
 * @param {Object} projection optionnal: choose which column in the database to get, will return everything if left empty.
 * @returns database returned values OR {error}.
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
            let userID = (await usersCollection.insertOne({username,email,hashedPassword,hashSalt,details,timeStamp})).insertedId.toString();
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

module.exports = {userSignup,userSignin,getUserProfileById,updateProfileDetails,
                createPost,getPosts};