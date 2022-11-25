const database = require("../db/database");

/**
 * get the user profile data from a given id. 
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
 *     'Note: This route must be called after a verification middleware that will verify if the user is legit '
*/
async function updateUserProfileDetails(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 
    let userID = res.locals.userID;
    let {aboutMe} = req.body;
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
 * create a user post in the database then returns a status code.
 * 
 *     'Note: This route must be called after a verification middleware that will verify if the user is legit '
*/
async function createUserPost(req,res){
    //must be called after the jwt verification middleware which should send the userID stored in the 
    //cookie 
    let userID = res.locals.userID;
    let {text} = req.body;
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



module.exports = {getUserProfileData,updateUserProfileDetails,
                createUserPost,getUserPosts};