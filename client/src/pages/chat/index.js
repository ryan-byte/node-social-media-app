import "../../assets/styles/chat.css"

import io from "socket.io-client";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import ChatUI from "./chatUI";
import ErrorOutput from "../../components/output/ErrorOutput";
import { getLoginCookieData, restricted_To_unLoggedUsers } from "../../utils/accessPage";

export default function Chat(){
    const [socket,setSocket] = useState(undefined);
    const [error,setError] = useState(undefined);
    const [messageArr,setMessageArr] = useState([]);
    const [userID] = useState(getLoginCookieData().userID);
    
    const navigate = useNavigate();

    //setup messages functions
    function add_sendMessage_UI(message, timestamp){
        setMessageArr((oldArr) => [...oldArr, {message, timestamp, type:"send"}]);
    }
    function add_receivedMessage_UI(message, timestamp){
        setMessageArr((oldArr) => [...oldArr, {message, timestamp, type:"receive"}]);
    }

    /**
     * sends the message to the server and adds the new message to the client UI
     * @param {*} message 
     */
    function send_message_socket(message){
        if (socket){
            socket.emit("send_message",message);
            //show the new message with its timestamp
            let timeStamp = Math.floor(Date.now() / 1000);
            add_sendMessage_UI(message, timeStamp);
        }
    }
    

    /**
     * join different room if the socket already open (to avoid disconnecting and connecting to another socket)
     * @param {Object} targetUserId 
     */
    function changeRoom(targetUserId){
        if (socket){
            socket.emit("changeRoom",targetUserId)
        }
    }


    useEffect(()=>{
        //restrict the access to this page
        restricted_To_unLoggedUsers(navigate);
        //create new socket
        const newSocket = io();
        setSocket(newSocket);

        newSocket.on("connect",()=>{
            console.log("user connected");
        })
        newSocket.on("disconnect",()=>{
            console.log("user disconnected");
        })
        //handle errors generated by a refused connection
        newSocket.on("connect_error", (err) => {
            if (err.data){
                //show an error if there is something wrong with the cookie credentials
                setError(err.message + ": " + err.data.details);
            }else{
                setError(err.message);
            }
        });
        newSocket.on("Error",(err)=>{
            setError(err);
        })
        //messages events
        newSocket.on("receive_message",({message, timeStamp})=>{
            add_receivedMessage_UI(message, timeStamp);
        });
        //loading messages
        newSocket.on("loading_messages",(loaded_messageArr)=>{
            loaded_messageArr.forEach(messageItem => {
                if (messageItem.sender === userID){
                    add_sendMessage_UI(messageItem.message, messageItem.timeStamp);
                }else{
                    add_receivedMessage_UI(messageItem.message, messageItem.timeStamp);
                }
            });
        });

        return ()=>{
            newSocket.off("connect");
            newSocket.off("disconnect");
            newSocket.off("connect_error");
            newSocket.off("Error");
            newSocket.off("receive_message");
            newSocket.off("loading_messages");
            newSocket.close();
        }
    }, [setSocket,userID,navigate]);

    return (
        <div>
            {error && <ErrorOutput message={error}/>}
            <ChatUI 
                changeRoom={changeRoom} 
                send_message_socket={send_message_socket} 
                messageArr={messageArr}
                setMessageArr={setMessageArr}/>
        </div>
    )
}