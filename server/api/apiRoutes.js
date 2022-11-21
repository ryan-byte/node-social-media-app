
/**
 * get the user profile data from a given id. 
 */
function getUserProfileData(req,res){
    const {id} = req.params;
    //get the profile data from the database
    let fakeData = {username:"lou",details:"bio..."}
    //send the data to the user
    res.send(fakeData);
}



module.exports = {getUserProfileData};