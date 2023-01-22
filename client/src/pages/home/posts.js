import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";
import UserPost from "../../components/userContent/UserPost";

import { getLoginCookieData } from "../../utils/accessPage";
import { GetFriends } from "../../utils/FriendsObject"
import useFetch from "../../hooks/useFetch";

export default function Posts(){
    //get the friends object inside the localstorage
    const currentUserInfo = getLoginCookieData();
    const currentUser_Friends = GetFriends();
    const friendsArr_id = currentUser_Friends ? Object.keys(currentUser_Friends.ids) : {};

    const {data: postsData,error,loading}= useFetch(`/api/user/friends/posts?friendsArr_id=${encodeURIComponent(JSON.stringify(friendsArr_id))}`);

    return (
        <div className="all-posts-holder">
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            
            {
                (postsData && postsData.length === 0) 
                &&
                <h3 className="text-center"> 
                    No publications available.
                </h3>
            }
            {
                postsData 
                && 
                postsData.map((post)=>{
                    let username = "";
                    if (post.userID === currentUserInfo.userID) username = currentUserInfo.username;
                    else username = currentUser_Friends.ids[post.userID].username;

                    return <UserPost key={post._id} postData={post} username={username} />
                })   
            }

        </div>
    )
}