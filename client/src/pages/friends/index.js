import "../../assets/styles/friends.css"

import ShowFriends from "./showFriends";
import { GetFriends } from "../../utils/FriendsObject"

export default function Friends(){
    const {ids : friends} = GetFriends();
    return (
        <div className="friends-container" >
            {
                friends && <ShowFriends friends={friends} />
            }
        </div>
    )
}