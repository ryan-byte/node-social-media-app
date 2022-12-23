import "../../assets/styles/friends.css"

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { restricted_To_unLoggedUsers } from "../../utils/accessPage";

import ShowFriends from "./showFriends";
import { GetFriends } from "../../utils/FriendsObject"

export default function Friends(){
    const friendsObject = GetFriends();
    
    const navigate = useNavigate();
    useEffect(()=>{
        restricted_To_unLoggedUsers(navigate);
    });
    
    return (
        <div className="friends-container" >
            {
                friendsObject && <ShowFriends friends={friendsObject.ids} />
            }
        </div>
    )
}