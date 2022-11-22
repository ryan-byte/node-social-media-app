const database = require("../db/database");
const cookieManager = require("../utils/cookieManager");

/**
 * this middleware will only let the user access the next route if his jwt token is valid,
 * if the jwt is invalid then it respond with 401 status code.
 * 
 * @param {Object} req required: request object.
 * @param {Object} res required: response object.
 * @param {Object} next required
 */
function loggedUsersAccess(req,res,next){
    let userVerifiedData = cookieManager.verifyLoginCookie(req);
    if (userVerifiedData){
        res.locals.userID = userVerifiedData.userID;
        next();
    }else{
        res.sendStatus(401);
    }
}



module.exports = {loggedUsersAccess};