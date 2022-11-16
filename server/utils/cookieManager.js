const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.jwtSecretKey;
const loginCookieName = "logged"


function giveUserLoginCookie(response,userID){
    let token = jwt.sign({userID},jwtSecretKey,{expiresIn: 60 * 60 * 24}); //expires in 1 day
    //add the access cookie which allow the user to do some actions in the backend
    response.cookie(loginCookieName, token, {
        httpOnly: true,
        sameSite:"strict",
        maxAge: 60 * 60 * 24 * 1000 //1 day
    });
}

module.exports = {giveUserLoginCookie};