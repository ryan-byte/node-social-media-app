import useFetch from "../../hooks/useFetch";

import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";
import UserPost from "../../components/userContent/UserPost";

export default function UserContent({userInfoData,visitedProfileID}){
    //get the user data
    const username = userInfoData.username;
    //get all the user posts
    const {data:userPosts,error,loading} = useFetch("/api/posts/" + visitedProfileID);
    

    return(
        <div className="all-posts-holder">
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            {
                (userPosts && userPosts.length === 0) 
                &&
                <h3 className="text-center"> 
                    No publications available
                </h3>
            }
            {
                userPosts 
                && 
                userPosts.map((post)=>
                    <UserPost key={post._id} postData={post} username={username} />
                )   
            }
        </div>
    )
}