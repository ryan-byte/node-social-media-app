const socketio = require("socket.io");
const {verifyLoginCookie} = require("../utils/cookieManager")
const database = require("../db/database");

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

    //socket io middleware for authorization
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

    //socket io middleware for getting the target user id
    io.use(async (socket,next)=>{
        let targetUserId = socket.handshake.query.targetUserId;
        if (targetUserId){
            //verify that the targetUserId is a correct object id

            //To Do
            let validID = await database.isValidID(targetUserId);
            if (validID){
                //pass targetUserId to the next route
                socket.data.targetUserId = targetUserId;
                next();
            }else{
                //send back an error to the user
                const err = new Error("invalid target user id");
                next(err);
            }
        }else{
            //send back an error to the user
            const err = new Error("target user not found");
            next(err);
        }
    })

    //socket io middleware for getting the room id
    io.use(async (socket,next)=>{
        const targetUserId = socket.data.targetUserId;
        const clientID = socket.data.userID;
        
        //get and join the room id
        let {roomID,errorMessage} = await database.getChatRoom(clientID,targetUserId);

        if (errorMessage){
            next (errorMessage);
        }else{
            socket.data.roomID = roomID;
            next();
        }

    })

    //setup the socketio events
    io.on('connection', async (client) => {
        const clientID = client.data.userID;
        const roomID = client.data.roomID;

        client.join(roomID);

        console.log("Server: client with the id "+ clientID +" connected to room "+ roomID);
        
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