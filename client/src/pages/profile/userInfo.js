import {useState,useEffect} from "react";
import postData from "../../utils/postData";
import ErrorOutput from "../../components/output/ErrorOutput";
import { getLoginCookieData } from "../../utils/accessPage";


export default function UserInfo({userInfoData}){
    //verify if the visited profile is the owner profile
    const visitedProfileID = userInfoData._id;
    const ownerID = getLoginCookieData().userID;
    const ownerProfileVisited = ownerID === visitedProfileID;
    //setting up userData that will be shown
    const username = userInfoData.username;
    const [aboutMe,setAboutMe] = useState("");
    useEffect(()=>{
        setAboutMe(userInfoData.details ? (userInfoData.details.aboutMe ? userInfoData.details.aboutMe : "" ) : "");
    },[userInfoData]);
    //setting up feedback states
    const [error,setError] = useState(undefined);
    //setting up functions
    async function editAboutMe(ev){
        ev.preventDefault();
        let data = {aboutMe};
        let request = await postData("/api/user/profile",data,"PUT");
        if (!request.ok){
            setError("Error status code: "+request.status);
        }
    }

    return(
        <div>
            username:{username}
            <br />
            {
                ownerProfileVisited &&
                <form onSubmit={editAboutMe}>
                    {error && <ErrorOutput message = {error}/>}
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">AboutMe</label>
                    <textarea onChange={(ev)=>{setAboutMe(ev.target.value)}} value={aboutMe} className="form-control" rows="3"></textarea>
                    <button type="submit">update</button>
                </form>
            }
            {
                !ownerProfileVisited &&
                <p>aboutMe:{aboutMe}</p>
            }
        </div>
    )
}