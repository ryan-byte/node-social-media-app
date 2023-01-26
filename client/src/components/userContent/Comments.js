import empty_profile from "../../assets/images/emptyProfile.png";
import ErrorOutput from "../output/ErrorOutput";

import {useNavigate,} from "react-router-dom";
import { memo, useState } from "react";
import postData from "../../utils/postData";

export default memo(Comments);


function Comments({commentsObj,postID}){
    const [commentText,setCommentText] = useState("");
    const [errorMessage,setErrorMessage] = useState(undefined);
    const navigate = useNavigate();

    async function addCommentOnSubmit(ev){
        ev.preventDefault();
        if (commentText === ""){
            return;
        }
        //disable the form button to prevent multiple requests
        ev.target.commentSubmit.disabled = true;
        
        let url = "/user/post/comment";
        let data = {
            'postID': postID,
            'commentText': commentText
        };
        let response = await postData(url,data,"POST");
        if (response.ok){
            //remove error message if exists 
            if (errorMessage){
                setErrorMessage(undefined);
            }
            //empty the comment text
            setCommentText("");
            //reload page if comment added successfully
            navigate(0);
        }else{
            //show error on fail
            setErrorMessage(`Error Occured, status code: ${response.status}`);
        }

        //enable the form button
        ev.target.commentSubmit.disabled = false;
    }

    return (
        <div>
            <hr />
            <div className="user-add-comment-container">
                <form className="user-add-comment-form" onSubmit={addCommentOnSubmit}>
                    <input value={commentText} onChange={(ev)=>setCommentText(ev.target.value)} 
                        className="user-add-comment-form-text" 
                        type="text" 
                        name="addComment" 
                        placeholder="Add Comment" />
                    <input className="user-add-comment-form-submit" 
                        id ="commentSubmit" 
                        type="submit" 
                        value="Add" />
                </form>
            </div>
            {errorMessage && <ErrorOutput message={errorMessage} />}
            <hr />
            <div>
                {   
                    commentsObj.commentArr.map((comment,index)=>{
                        return (
                            <div key={index}>
                                <div className="pb-2">
                                    <span className="button" 
                                        onClick = {() => {navigate("/profile/"+comment.userID)}}>

                                        <img className="user-comment-profile-image mx-1" 
                                            src={empty_profile} 
                                            alt="user post profile" />
                                        {comment.username}

                                    </span>
                                </div>
                                <div className="user-post-content mx-3">
                                    {comment.text}
                                </div>
                                <hr /> 
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}