const {verifyLoginCookie} = require("../utils/cookieManager")


function clientAuthentication(socket, next){
    let loginCookie = verifyLoginCookie(socket.request);
    if (loginCookie){
        //pass userID to the next route
        socket.data = {userID : loginCookie.userID}
        next();
    }else{
        //send back an error to the user indicating that he must login before using chat
        const err = new Error("unauthorized");
        err.data = { details: "Make sure you are logged in, try logging out then in.\n If this error continues please contact us" }; // additional details
        next(err);
    }
}

module.exports = {
    clientAuthentication
}