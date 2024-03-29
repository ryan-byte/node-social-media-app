import "../../assets/styles/profile.css"
import "../../assets/styles/posts.css"

import {useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { getLoginCookieData } from "../../utils/accessPage";

import UserInfo from "./userInfo";
import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";
import UserImages from "./userImages";
import UserContent from "./userContent";
import UserPublish from "../../components/form/userPublish";
import Interact from "./interact";

import { GetFriends } from "../../utils/FriendsObject"

export default function Profile(){
    const {id} = useParams();
    //make a request to the server with the id params to get user details
    const {data:userInfoData,error,loading} = useFetch("/api/user/profile/"+id);
    
    //verify if the visited profile is the owner profile
    const ownerID = getLoginCookieData().userID;
    const ownerProfileVisited = ownerID === id;

    //get the friends object inside the localstorage
    const currentUser_Friends = GetFriends();

    return (
        <div>
            {userInfoData && <UserImages userInfoData={userInfoData} ownerProfileVisited={ownerProfileVisited}/>}

            {
                (userInfoData && currentUser_Friends)
                && <Interact 
                        userInfoData={userInfoData} 
                        ownerProfileVisited={ownerProfileVisited}
                        currentUser_Friends={currentUser_Friends}
                    />
            }
            
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            {userInfoData && <UserInfo userInfoData={userInfoData} ownerProfileVisited={ownerProfileVisited} />}
            {ownerProfileVisited && <UserPublish />}
            {userInfoData && <UserContent userInfoData={userInfoData} visitedProfileID={id} />}
        </div>
    )
}