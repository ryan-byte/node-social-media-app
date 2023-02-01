const socketio = require("socket.io");
const database = require("../db/database");

const chatMiddleware = require("./chatMiddleware");

/**
 * the prefix is created so that there is no conflict between both rooms,
 * because they are using the database id and sometimes conflict will happen.
 */
const chatRoomPrefix = "chat-room:"
//the client room will be used for sharing online/offline status to the online friends 
const clientRoomPrefix = "client-room:"



/**
 * the setup for the websocket chat in the server
 * @param {HttpServer} server must be server created by http
 * @example
 * const express = require("express");
 * const app = express();
 * const server = require("http").createServer(app);
 * thisFunction(server);
 */
module.exports = function Chat(server){
    const io = socketio(server);

    // socket io middleware for authentication
    io.use(chatMiddleware.clientAuthentication);

    // this will be used to store connected users and their socket id
    let connectedUsers = {};

    // setup the socketio events
    io.on('connection', async (client) => {
        const clientID = client.data.userID;
        let room = "";

        //add user to connected object + the socket id
        connectedUsers[clientID] = client.id;
        
        await setup_UserOnlineStatus(io, client, clientID, connectedUsers);

        client.on("disconnect", () => {
            console.log("Server: Client "+ clientID +" disconnected");

            //remove user to connected object
            delete connectedUsers[clientID]
        });
        
        //change user room event
        client.on("changeRoom", async(targetUserId)=>{
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
                room = chatRoomPrefix + roomID;
                client.join(room);
                //load the room messages
                const {messageArr} = await database.loadChatMessages(room);
                //send the loaded messages to the client
                if (messageArr) client.emit("loading_messages",messageArr); 
            }
        });

        //messages events
        client.on("send_message", async(message)=>{
            let validIds = await database.isValidID(room) && await database.isValidID(clientID);
            
            if (validIds){
                //save the message
                let {status,timeStamp} = await database.saveChatMessage(clientID,room,message);
                if (status === 200){
                    //send message to everyone else in the room
                    client.to(room).emit("receive_message",{message, timeStamp});
                }
            }
        })
    });
}


/**
 * this function must be called when the client connects after authentication.
 * Is used to setup the online/offline status between the user and his friends.
 * @param {Object} io socket io server instance
 * @param {Object} client current client socket
 * @param {Object} clientID the id of the client from the database
 * @param {Object} connectedUsers all the connected users to the socket io server
 */
async function setup_UserOnlineStatus(io, client, clientID, connectedUsers){
    //tell the server that a client has connected
    console.log("Server: client connected with the id "+ clientID);

    //connect the client to his own room that his online friends will join so he can tell them that he is online or offlie later
    let clientRoom = clientRoomPrefix + clientID;
    client.join(clientRoom);
    
    //retrieve the friends ids of the current client
    let {friends, error} = await database.getUserFriendsDataById(clientID);
    if (friends === undefined){
        console.error("\x1b[31m" + "error from chay.js > setup_UserOnlineStatus: \n"+ "\x1b[0m" + error);
        return;
    }
    let friendsIDs = Object.keys(friends.ids) 

    //when the friend is connected add them to the current userID room and add the user to their room
    let onlineFriends = [];
    friendsIDs.forEach(friendID => {
        if (connectedUsers[friendID]){
            let friendRoom = clientRoomPrefix + friendID;
            let friendSocketId = connectedUsers[friendID];
            let friendSocket = io.sockets.sockets.get(friendSocketId);
            onlineFriends.push(friendID);

            //connect the current client to the friend room
            client.join(friendRoom);
            
            //connect the friend to the current client room
            friendSocket.join(clientRoom);
        }
    });

    //emit an event to everyone connected to the client room indicating that he is now online
    client.to(clientRoom).emit("user_online", clientID);

    //emit an event to the client giving him his connected friends list
    if (onlineFriends.length > 0){
        client.emit("friends_online", onlineFriends);
    }
}