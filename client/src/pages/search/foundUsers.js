import empty_profile from "../../assets/images/emptyProfile.png";

import {useNavigate} from "react-router-dom";

export default function FoundUsers({usersArray}){
    const navigate = useNavigate();
    return (
        <div>
            {
                usersArray.map((user)=>
                    <div 
                    className="search-user-holder" 
                    key={user._id} 
                    onClick = {() => {navigate("/profile/"+user._id)}} >
                        <img 
                            className="user-post-profile-image" 
                            src={empty_profile} 
                            alt= {user.username + " profile"} />
                        <div className="ms-2">                                
                            {user.username}
                        </div>
                    </div>
                )
            }
        </div>
    )
}