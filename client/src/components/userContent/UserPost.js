import { memo, useState, useEffect } from "react";

import { convertTimestamp } from "../../utils/utils";
import empty_profile from "../../assets/images/emptyProfile.png";
import { ReactComponent as Like } from  '../../assets/svg/like.svg';
import { ReactComponent as Comment } from  '../../assets/svg/comment.svg';

import postData from "../../utils/postData";
import { getLoginCookieData } from "../../utils/accessPage";
import Comments from "./Comments";

//used memo export so the parent wont keep rerendering this component on every change
export default memo(UserPost);

/**
 * makes a request to add and remove like of a post
 * @returns request object
 */
async function likeRequest(postID){
    let data = {
        postID
    };
    return await postData("/user/post/like",data,"PUT");
}


function UserPost({postData,username}){
    const [totalLikes,setTotalLikes] = useState(postData.likes ? postData.likes.total: 0);
    const [totalComments] = useState(postData.comments ? postData.comments.total: 0);
    const [alreadyLike,setAlreadyLike] = useState(false);
    const [postID] = useState(postData._id);
    const [showComments,setShowComments] = useState(false);

    async function likePressed(ev){
        let element = ev.currentTarget;
        if (element.classList.contains("active-like")){
            element.classList.remove("active-like");
            setTotalLikes(totalLikes-1);
            //make a request
            await likeRequest(postID);
        }else{
            element.classList.add("active-like");
            setTotalLikes(totalLikes+1);
            //make a request
            await likeRequest(postID);
        }
    }
    function commentIconPressed(){
        setShowComments(!showComments);
    }

    useEffect(()=>{
        //make the like active if the use already liked it
        //get the userID
        let userID = getLoginCookieData().userID;
        //check if the userID is in the likes.users
        let userAlreadyLikedPost = postData.likes ? userID in postData.likes.users: false; 
        //activate like button if exists
        if (userAlreadyLikedPost) setAlreadyLike(true);

    },[setAlreadyLike,postData])
    return(
        <div>
            <div className="user-post-container">
                <div className="px-4 pt-4">
                    <div className="d-flex">
                        <img className="user-post-profile-image" 
                            src={empty_profile} 
                            alt="user post profile" />
                        <div className="d-flex flex-column bd-highlight ps-2">
                            <div className="bd-highlight">
                                <h5 style={{"margin":"0"}}>{username}</h5>
                            </div>
                            <div className="bd-highlight">
                                <code>
                                    {convertTimestamp(postData.timeStamp)}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="user-post-content px-4">
                    {postData.text}
                </div>
                <hr />
                <div className="post-interaction-container">
                    <div className="button">
                        <span className = "no-select">
                            {totalLikes}
                        </span>
                        <Like className={alreadyLike ? "post-interaction-item active-like": "post-interaction-item"} 
                            onClick={likePressed}/>
                    </div>
                    <div className="button">
                        <span className = "no-select">
                            {totalComments}
                        </span>
                        <Comment className="post-interaction-item"
                            onClick={commentIconPressed}
                        />
                    </div>
                </div>
                {
                    showComments && < Comments commentsObj={postData.comments} postID={postData._id} />
                }
            </div>
            <br/>
        </div>
    )
}


