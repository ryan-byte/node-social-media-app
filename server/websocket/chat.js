const socketio = require("socket.io");
const {verifyLoginCookie} = require("../utils/cookieManager")

/**
 * the setup for the websocket chat in the server
 * @param {HttpServer} server must be server created by http
 * @example:
 * const express = require("express");
 * const app = express();
 * const server = require("http").createServer(app);
 * thisFunction(server);
 */
function Chat(server){
    // try path chat later
    const io = socketio(server);

    //create a socket io middleware for authorization
    io.use((socket, next) => {
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
    });

    //setup the socketio 
    io.on('connection', client => {
        const clientID = client.data.userID;
        console.log("Server: client with the id "+ clientID +" connected");
        client.on("disconnect", () => {
            console.log("Server: Client "+ clientID +" disconnected");
        });
        client.on("ping",()=>{
            client.emit("pong");
            console.log("client pinged");
        })
    });
}



module.exports = Chat;