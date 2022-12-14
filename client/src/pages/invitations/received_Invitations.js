import {useNavigate} from "react-router-dom";

import empty_profile from "../../assets/images/emptyProfile.png";

export default function ReceivedInvitations({usersArray}){
    const navigate = useNavigate();
    
    return (
        <div>
            {
                usersArray.map((user)=>
                    <div 
                    className="invitations-user-holder" 
                    key={user._id} >
                        <img 
                            className="user-post-profile-image invitation-user-link" 
                            src={empty_profile} 
                            alt= {user.username + " profile"}
                            onClick = {() => {navigate("/profile/"+user._id)}}  />
                        <div className="ms-2 invitation-user-link"
                            onClick = {() => {navigate("/profile/"+user._id)}} >
                            {user.username}
                        </div>
                        <div className="invitation-buttons">
                            <input type="button" class="invitation-accept" value="Accept" />
                            <input type="button" class="invitation-decline" value="Decline" />
                        </div>
                    </div>
                )
            }
        </div>
    )
}