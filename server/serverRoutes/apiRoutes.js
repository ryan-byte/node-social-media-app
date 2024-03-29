const database = require("../db/database");
const hashPassword = require("../utils/hashPassword");
const cookieManager = require("../utils/cookieManager");
const firebase = require("../cloudStorage/firebase");


/**
 * finds users with a similar username
 * 
 * requires (username) to be sent in the body as form urlencoded 
 * 
 * @param {Required} req 
 * @param {Required} res 
 * @returns 
 */
 async function searchUser(req,res){
    //get the userID from the requested param
    let {username} = req.params;
    let badParams = username == undefined ||
                    username === ""||
                    typeof username !== "string";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    username = username.trim();
    if (username.length === 0){
        res.sendStatus(400);
        return;
    }
    //get the users from the database
    let {status,users} = await database.getUsersByName(username);
    if (status === 200){
        res.status(200).json(users);
    }else{
        res.sendStatus(status);
    }
}

//user profile

/**
 * get the user profile data from a given id. 
 * @param {Required} req 
 * @param {Required} res 
 */
async function getUserProfileData(req,res){
    const {id} = req.params;
    //get the profile data from the database
    let data = await database.getUserProfileById(id);
    //send the data to the user
    if (data.status){
        res.sendStatus(data.status);
    }else{
        res.status(200).send(data);        
    }
}

/**
 * update the user profile details, must pass the updated details in the body as x-www-form-urlencoded.
 * 
 *      *     'Note: This route must be called after a verification middleware that will verify if the user authorized '
 * @param {Required} req 
 * @param {Required} res 
*/
async function updateUserProfileDetails(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 
    let userID = res.locals.userID;
    let {aboutMe} = req.body;
    if (aboutMe) aboutMe = aboutMe.trim();
    let badParams = aboutMe == undefined ||
                    aboutMe === ""||
                    typeof aboutMe !== "string";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //check the length of the aboutMe if it is accepted
    if (aboutMe.length > 70){
        res.sendStatus(400);
        return;
    }
    //update the data in the database
    let {status} = await database.updateProfileDetails(userID,aboutMe);
    //send back a status code
    res.sendStatus(status);
}

/**
 * change the username of a user by getting his id from the stored cookie then update the username in the database.
 * 
 *      *     'Note: This route must be called after a verification middleware that will verify if the user authorized '
 * @param {Required} req 
 * @param {Required} res 
 */
async function updateUsername(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 

    let userID = res.locals.userID;
    let {username} = req.body;
    if (username) username = username.trim();

    let badParams = username == undefined ||
                    username === ""||
                    typeof username !== "string";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //update the username in the database
    let {status,modifiedCount} = await database.updateUsername(userID,username);
    if (modifiedCount && modifiedCount !== 0){
        //update the cookies
        cookieManager.giveUserLoginInfoCookie(res,{username,userID});
    }
    res.sendStatus(status);
}

/**
 * change the password of a user by getting his id from the stored cookie 
 * then verify if the old password is correct in the database, if verified then save the password.
 * 
 * requires (oldPassword and password) to be sent in the body as form urlencoded 
 * 
 *      *     'Note: This route must be called after a verification middleware that will verify if the user authorized '
 * @param {Required} req 
 * @param {Required} res 
 */
async function updatePassword(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 

    let userID = res.locals.userID;
    let {oldpassword,password} = req.body;
    let badParams = oldpassword == undefined ||
                    oldpassword === ""||
                    typeof oldpassword !== "string"||
                    password == undefined ||
                    password === ""||
                    password.length < 8||
                    typeof password !== "string"||
                    password === oldpassword;
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //verify the password in the database
    let {status : verifyPasswordStatus} = await database.verifyUserPassword(userID,oldpassword);
    if (verifyPasswordStatus !== 200){
        res.sendStatus(verifyPasswordStatus);
        return;
    }
    //setup hashSalt and hashedPassword
    let hashSalt = hashPassword.hashSalt();
    let hashedPassword = hashPassword.hashPassword(password,hashSalt);
    //update the password
    let {status} = await database.updateUserPassword(userID,hashedPassword,hashSalt);
    res.sendStatus(status);
}

/**
 * update the user profile Image
 * 
 *     'Note: This route must be called after a verification middleware that will verify if the user authorized and uploadImage middleware'
 * @param {Required} req 
 * @param {Required} res 
 */
async function updateProfileImage(req,res){
    const userID = res.locals.userID;
    const fileName = res.locals.fileName;
    const imageUrl = res.locals.imageUrl;
    //get current user image
    let {imageName} = await database.getUserProfileImage(userID);
    //if the image exists then delete it from the cloud storage
    if (imageName){
        let result = await firebase.deleteImage(imageName);
        //delete the image only if the status code is different from 404 (because if the image is not found the script should keep going)
        if (result && result.error.code !== 404){
            res.status(502).send("Error while deleting the old image");
            return;
        }
    }
    //update the user image url to the current url
    let {status} = await database.updateUserProfileImage(userID,imageUrl,fileName);

    res.sendStatus(status);
}

//user posts

/**
 * create a user post in the database then returns a status code.
 * 
 *      *     'Note: This route must be called after a verification middleware that will verify if the user authorized '
 * @param {Required} req 
 * @param {Required} res 
*/
async function createUserPost(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 
    let userID = res.locals.userID;
    let {text} = req.body;
    if (text) text = text.trim();
    let badParams = text == undefined ||
                    text === ""||
                    typeof text !== "string";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    if (text.length > 500){
        res.sendStatus(400);
        return;
    }
    //update the data in the database
    let {status} = await database.createPost(userID,text);
    //send back a status code
    res.sendStatus(status);
}

/**
 * get all the posts of a user then return json and a status code
 * @param {Required} req 
 * @param {Required} res 
*/
async function getUserPosts(req,res){
    //get the userID from the requested param
    let {userID} = req.params;
    let badParams = userID == undefined ||
                    userID === ""||
                    typeof userID !== "string";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //update the data in the database
    let {status,output} = await database.getPosts(userID);
    //send back a status code
    if (status === 200){
        res.status(status).json(output);
        return;
    }
    res.sendStatus(status);
}


//friends

/**
 * requires (friendsArr_id) to be sent in the body as form urlencoded 
 * 
 *      'Note: This route must be called after a verification middleware that will verify if the user authorized '
 *
 * @param {Required} req 
 * @param {Required} res 
 */
async function getFriendsPosts(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 
    let userID = res.locals.userID;
    //get friends list
    let {friendsArr_id} = req.query;

    //check if there is a bad params
    let badParams = friendsArr_id == undefined;
    if (badParams){
        res.sendStatus(400);
        return;
    }

    //parse the string to an object
    if (typeof(friendsArr_id) === "string"){
        try{
            friendsArr_id = JSON.parse(friendsArr_id);
        }catch (err){
            res.sendStatus(400);
            return;
        }
    }

    //adds the current userID to get all the friends posts including the current user posts
    friendsArr_id.push(userID);
    //get the data from the database
    const {status,output} = await database.getFriendsPosts(friendsArr_id);
    
    //send back the data to the client
    if (status === 200){
        res.status(status).json(output);
        return;
    }
    res.sendStatus(status);
}



module.exports = {getUserProfileData,updateUserProfileDetails,
                createUserPost,getUserPosts,
                updateUsername,updatePassword,
                searchUser,getFriendsPosts,updateProfileImage};