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
 */
async function updateUserProfileDetails(req,res){
    //must be called after the jwt verification middleware which should send the userData stored in the 
    //cookie 
    let userID = res.locals.userID;
    let {aboutMe} = req.body;
    let badParams = aboutMe == undefined ||
                    aboutMe === "";
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //update the data in the database
    let {status} = await database.updateProfileDetails(userID,aboutMe);
    //send back a status code
    res.sendStatus(status);
}



module.exports = {getUserProfileData,updateUserProfileDetails};