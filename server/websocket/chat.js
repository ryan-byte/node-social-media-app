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

    //setup the socketio events
    io.on('connection', async (client) => {
        const clientID = client.data.userID;
        let room = "";

        console.log("Server: client connected with the id "+ clientID);
        client.on("disconnect", () => {
            console.log("Server: Client "+ clientID +" disconnected");
        });
        //change user room event
        client.on("changeRoom", async (targetUserId)=>{
            //gets the unique room for both users
            let {roomID,errorMessage} = await database.getChatRoom(clientID,targetUserId);
            if (errorMessage){
                //in case of an error send it to the client
                client.emit("Error",errorMessage);
            }else{
                //if everything went fine then change the room of the client
                if (room !== ""){
                    client.leave(room);
                }
                room = roomID;
                client.join(room);
            }
        });
        //messages events
        client.on("send_message",(message)=>{
            client.to(room).emit("receive_message",message);
        })
    });
}



module.exports = Chat;