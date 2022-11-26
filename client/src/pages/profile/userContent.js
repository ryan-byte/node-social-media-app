import empty_profile from "../../assets/images/emptyProfile.png";
import useFetch from "../../hooks/useFetch";
import timePassedBy from "../../utils/timePassedBy";

import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";
import { ReactComponent as Like } from  '../../assets/svg/like.svg';
import { ReactComponent as Comment } from  '../../assets/svg/comment.svg';
import { ReactComponent as Share } from  '../../assets/svg/share.svg';

export default function UserContent({userInfoData}){
    //get the user data
    const username = userInfoData.username;
    //get the visited user id
    const visitedProfileID = userInfoData._id;
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
                userPosts.map((post,index)=>
                <div key={post._id}>
                    <div className="user-post-container">
                        <div className="px-4 pt-4">
                            <div className="d-flex">
                                <img className="user-post-profile-image" src={empty_profile} alt="user post profile" />
                                <div className="d-flex flex-column bd-highlight ps-2">
                                    <div className="bd-highlight">
                                        <h5 style={{"margin":"0"}}>{username}</h5>
                                    </div>
                                    <div className="bd-highlight">
                                        <code>
                                            {timePassedBy(post.timeStamp)}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="user-post-content px-4">
                            {post.text}
                        </div>
                        <hr />
                        <div className="post-interaction-container">
                            <div>
                                <Like className="post-interaction-item"/>
                            </div>
                            <div>
                                <Comment className="post-interaction-item"/>
                            </div>
                            <div>
                                <Share className="post-interaction-item"/>
                            </div>
                        </div>
                    </div>
                    <br/>
                </div>
                )   
            }
        </div>
    )
}