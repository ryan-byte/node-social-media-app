import empty_profile from "../../assets/images/emptyProfile.png";
import {useState} from "react";
import postData from "../../utils/postData";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/feedback/Loading";


export default function UserPublish(){
    const navigate = useNavigate();
    //setup states
    const [textContent,setTextContent] = useState("");
    const [loading,setLoading] = useState(false);
    
    async function onSubmitPost(ev){
        ev.preventDefault();
        if (textContent === ""){
            return;
        }

        //start loading
        setLoading(true);
        //disable the form button
        ev.target.publish.disabled = true;
        //post the data
        let data = {"text":textContent};
        let response = await postData("/api/user/post",data);
        if (response.ok){
            navigate(0);
            return;
        }
        //enable the form button
        ev.target.publish.disabled = false;
        //stop loading
        setLoading(false);
    }

    return (
        <div className="user-publish-container">
            <form className="user-publish-form" onSubmit={onSubmitPost}>
                <img src={empty_profile} alt="profile" className="user-post-profile-image"/>
                <input value={textContent} onChange={(ev)=>setTextContent(ev.target.value)} className="user-publish-form-text" type="text" name="post" placeholder="What are you thinking about ?" />
                <input className="user-publish-form-submit" id ="publish" type="submit" value="Publish" />
                {loading && <Loading />}
            </form>
        </div>
    );
}