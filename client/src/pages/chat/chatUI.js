import empty_profile from "../../assets/images/emptyProfile.png";
import { GetFriends } from "../../utils/FriendsObject";
import {useState,useEffect} from "react";

export default function ChatUI({changeRoom}){
    const [friends,setFriends] = useState(undefined);
    const [activeUser,setActiveUser] = useState(null);

    function changeTargetUser(id){
        //set the active user for the user feedback
        if (id !== activeUser){
            setActiveUser(id);
            //set the active user for the socket to change rooms
            changeRoom(id);
        }
    }

    function renderFriends(friends){
        let elementsArray = [];
        for (const id in friends){
            elementsArray.push(
                <div 
                className={activeUser === id ? "chat-user-holder active" : "chat-user-holder"}
                onClick={(ev)=>changeTargetUser(id)}
                key={id} > 
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


    useEffect(()=>{
        setFriends(GetFriends)
    }, [])
    

    return (
        <div className="chat-container">
            <div className="chat-users-side">
                {friends && renderFriends(friends.ids)}
            </div>


            <div className="chat-messages-side">
                <div className="chat-all-messages-holder">
                    <div className="chat-message-holder">
                        <div className="chat-message-currentUser">
                            i am the current user
                        </div>
                    </div>
                    <div className="chat-message-holder">
                        <div className="chat-message-otherUser">
                            i am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current user
                        </div>
                    </div>
                    <div className="chat-message-holder">
                        <div className="chat-message-currentUser">
                            i am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current user
                        </div>
                    </div>
                    <div className="chat-message-holder">
                        <div className="chat-message-currentUser">
                            i am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current useri am the current user
                        </div>
                    </div>
                </div>
                
                <div className="chat-input-holder">
                    <input type="text" className="chat-input-text" placeholder="Type your message here" />
                    <input type="submit" className="chat-input-button" value="Send" />
                </div>
            </div>

        </div>
    )
}