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
    let verifiedToken = cookieManager.verifyLoginCookie(req);
    if (verifiedToken){
        next();
    }else{
        res.sendStatus(401);
    }
}

/**
 * this middleware will only let the user access the next route if his jwt token is invalid or he doesnt have it,
 * if the jwt is valid then it will respond with 401 status code.
 * 
 * @param {Object} req required: request object.
 * @param {Object} res required: response object.
 * @param {Object} next required
 */
function noLoggedUsersOnly(req,res,next){
    let verifiedToken = cookieManager.verifyLoginCookie(req);
    if (verifiedToken){
        res.sendStatus(401);
    }else{
        next();
    }
}



module.exports = {loggedUsersAccess,noLoggedUsersOnly};