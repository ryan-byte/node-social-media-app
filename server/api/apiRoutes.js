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



module.exports = {getUserProfileData};