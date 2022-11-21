const jwt = require("jsonwebtoken");
const cookie = require("cookie");

const jwtSecretKey = process.env.jwtSecretKey;
const loginCookieName = "logged";
const userCookieName = "user"

/**
 * adds a login cookie to the HTTP response, javascript in the client side cannot access this cookie so 
 * this cookie is protected from certain attacks on the client side also the data in the cookie are signed by jwt,
 * use this cookie to verify the identity of the user.
 * @param {*} response HTTP response.
 * @param {*} userID 
 */
function giveUserLoginCookie(response,userID){
    let token = jwt.sign({userID},jwtSecretKey,{expiresIn: 60 * 60 * 24}); //expires in 1 day
    //add the access cookie which allow the user to do some actions in the backend
    response.cookie(loginCookieName, token, {
        httpOnly: true,
        sameSite:"strict",
        maxAge: 60 * 60 * 24 * 1000 //1 day
    });
}
/**
 * adds a login info cookie to the HTTP response, client can access this cookie and can change it so dont
 * rely on it for verification, this cookie is only used so the client can get some informations
 * about their account like their username or email.
 * @param {*} response HTTP response
 * @param {*} data 
 */
function giveUserLoginInfoCookie(response,data){
    data = JSON.stringify(data);
    response.cookie(userCookieName, data, {
        maxAge: 60 * 60 * 24 * 1000 //1 day
    });
}

/**
 * verify the jwt data stored in the login cookie that has been sent in the HTTP request.
 * @param {*} request HTTP request
 * @returns decoded jwt if verified otherwise undefined 
 */
function verifyLoginCookie(request){
    //get jwt token
    let cookies = cookie.parse(request.headers.cookie || "");
    let value = cookies[loginCookieName];
    try{
        //verify the jwt token
        let decode = jwt.verify(value,jwtSecretKey);
        return decode;
    }catch (err){
        return undefined;
    }
}

module.exports = {giveUserLoginCookie,verifyLoginCookie,giveUserLoginInfoCookie};