const socketio = require("socket.io");

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
    // const newServer = new socketio.Server(server,{
    //     path:"/test/"
    // })
    const io = socketio(server);

    io.on('connection', client => {
        console.log("Server: New client connected");
        client.on("disconnect", () => {
          console.log("Server: Client disconnected");
        });
        client.on("ping",()=>{
          client.emit("pong");
          console.log("client pinged");
        })
    });
}



module.exports = Chat;