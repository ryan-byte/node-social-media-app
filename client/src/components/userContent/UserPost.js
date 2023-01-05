import { memo } from "react";

import timePassedBy from "../../utils/timePassedBy";
import empty_profile from "../../assets/images/emptyProfile.png";
import { ReactComponent as Like } from  '../../assets/svg/like.svg';
import { ReactComponent as Comment } from  '../../assets/svg/comment.svg';
import { ReactComponent as Share } from  '../../assets/svg/share.svg';


//used memo export so the parent wont keep rerendering this component on every change
export default memo(UserPost);

function UserPost({postData,username}){

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
                                    {timePassedBy(postData.timeStamp)}
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