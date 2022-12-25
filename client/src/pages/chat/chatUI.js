import empty_profile from "../../assets/images/emptyProfile.png";


export default function ChatUI(){
    return (
        <div className="chat-container">
            <div className="chat-users-side">
                <div className="chat-user-holder"> 
                    <img 
                        className="user-post-profile-image invitation-user-link" 
                        src={empty_profile} 
                        alt="profile"/>
                    <span className="ms-2">
                        user1
                    </span>
                </div>
                <div className="chat-user-holder active">
                    <img 
                        className="user-post-profile-image invitation-user-link" 
                        src={empty_profile} 
                        alt="profile" />
                    <span className="ms-2">
                        thesoulsreaper15
                    </span>
                </div>
                <div className="chat-user-holder">
                    <img 
                        className="user-post-profile-image invitation-user-link" 
                        src={empty_profile} 
                        alt="profile" />
                    <span className="ms-2">
                        user3
                    </span>
                </div>
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