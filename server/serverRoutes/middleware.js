const database = require("../db/database");
const cookieManager = require("../utils/cookieManager");


function loggedUsersAccess(req,res,next){
    let verifiedToken = cookieManager.verifyLoginCookie(req);
    if (verifiedToken){
        next();
    }else{
        res.sendStatus(401);
    }
}
function noLoggedUsersOnly(req,res,next){
    let verifiedToken = cookieManager.verifyLoginCookie(req);
    if (verifiedToken){
        res.sendStatus(401);
    }else{
        next();
    }
}



module.exports = {loggedUsersAccess,noLoggedUsersOnly};