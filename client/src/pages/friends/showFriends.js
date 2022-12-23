import empty_profile from "../../assets/images/emptyProfile.png";

import {useNavigate} from "react-router-dom";

export default function ShowFriends({friends}){
    const navigate = useNavigate();

    function renderFriends(friends){
        let elementsArray = [];
        for (const id in friends){
            elementsArray.push(
                    <div 
                    className="friends-user-holder" 
                    key={id} 
                    onClick = {() => {navigate("/profile/"+id)}}>
                        <img 
                            className="user-post-profile-image friends-user-link" 
                            src={empty_profile} 
                            alt= {friends[id].username + " profile"}/>
                        <div className="mx-3">
                            {friends[id].username}
                        </div>
                    </div>
            )
        }
        return elementsArray;
    }

    return (
        <div>
            {renderFriends(friends)}
        </div>
    )
}