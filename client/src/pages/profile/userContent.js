import empty_profile from "../../assets/images/emptyProfile.png";

import { ReactComponent as Like } from  '../../assets/svg/like.svg';
import { ReactComponent as Comment } from  '../../assets/svg/comment.svg';
import { ReactComponent as Share } from  '../../assets/svg/share.svg';

export default function UserContent(){
    return(
        <div className="all-posts-holder">
            <div className="user-post-container">
                <div className="px-4 pt-4">
                    <div className="d-flex">
                        <img className="user-post-profile-image" src={empty_profile} alt="user post profile" />
                        <h5 className="px-4">username</h5>
                    </div>
                </div>
                <hr />
                <div className="user-post-content px-4">
                    Welcome to my prototype app.
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
        </div>
    )
}