import empty_profile from "../../assets/images/emptyProfile.png";
import { GetFriends } from "../../utils/FriendsObject";
import {useState,useEffect, memo} from "react";
import MessageComponent from "./messageComponent";
import Loading from "../../components/feedback/Loading";

export default memo(ChatUI)

function ChatUI({changeRoom, send_message_socket, messageArr, setMessageArr, loading, onlineFriends}){
    const [friends,setFriends] = useState(undefined);
    const [activeUser,setActiveUser] = useState(null);
    const [message, setMessage] = useState("");

    

    //change the target friend to talk to
    function changeTargetUser(id){
        //dont change target user if it is already active
        if (id !== activeUser){
            //set the active user for the user feedback
            setActiveUser(id);
            //set the active user for the socket to change rooms
            changeRoom(id);
            //empty the chat
            setMessageArr([]);
        }
    }

    //render the friends sid
    function renderFriends(friends){
        let elementsArray = [];
        for (const id in friends){
            elementsArray.push(
                <div 
                className={activeUser === id ? "chat-user-holder active" : "chat-user-holder"}
                onClick={()=>changeTargetUser(id)}
                key={id} > 
                    {/* the following div is used in the online, offline user status */}
                    <div className = {onlineFriends[id] ? "status-indicator online mx-2" : "status-indicator offline mx-2"}></div>
                    <img 
                        className="user-post-profile-image invitation-user-link" 
                        src={empty_profile} 
                        alt="profile"/>
                    <span className="ms-2">
                        {friends[id].username}
                    </span>
                </div>
            );
        }
        return elementsArray;
    }
    
    //when a message has been sent to the server
    function onMessageSubmit(ev){
        ev.preventDefault();
        if (message !== ""){
            send_message_socket(message);
            setMessage("");
        }
    }

    useEffect(()=>{
        setFriends(GetFriends());
    }, [])
    

    return (
        <div className="chat-container">
            {/* friends side */}
            <div className="chat-users-side">
                {friends && renderFriends(friends.ids)}
            </div>


            {
                activeUser &&
                <div className="chat-messages-side">
                    {/* chat messages */}
                    <div id="messages" className="chat-all-messages-holder">
                        {
                            messageArr.map(({message ,timestamp, type},id)=>{
                                return (<MessageComponent key={id} message={message} type={type} timestamp={timestamp} />)
                            })
                        }
                        
                        {/* loading */}
                        {loading && <Loading/>}

                    </div>

                    {/* submit message */}
                    <form onSubmit={onMessageSubmit} className="chat-input-holder">
                        <input value = {message} onChange={(ev)=>setMessage(ev.target.value)} type="text" className="chat-input-text" placeholder="Type your message here" />
                        <input type="submit" className="chat-input-button" value="Send" />
                    </form>
                </div>
            }

        </div>
    )
}