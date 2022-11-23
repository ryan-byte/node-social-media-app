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
    const [aboutMe,setAboutMe] = useState("");
    useEffect(()=>{
        setAboutMe(userInfoData.details ? (userInfoData.details.aboutMe ? userInfoData.details.aboutMe : "" ) : "");
    },[userInfoData]);

    //setting up feedback states
    const [error,setError] = useState(undefined);

    //setting up functions
    async function editAboutMe(ev){
        if (ev.key === 'Enter') {
            ev.preventDefault();
            let data = {aboutMe};
            let request = await postData("/api/user/profile",data,"PUT");
            if (!request.ok){
                setError("Error status code: "+request.status);
            }
            document.activeElement.blur();
        }
    }

    return(
        <div>
            <div>
                {
                    ownerProfileVisited ?
                    <form onKeyDown={editAboutMe} className="text-center pofile-aboutMe-Container">
                        {error && <ErrorOutput message = {error}/>}
                        <textarea className="form-control profile-aboutMe position-absolute top-50 start-50 translate-middle" onChange={(ev)=>{setAboutMe(ev.target.value);}} maxLength="70" value={aboutMe} rows="3"></textarea>
                    </form> :
                    <div className="pofile-aboutMe-Container">
                        <p className="profile-aboutMe position-absolute top-50 start-50 translate-middle">
                            {aboutMe}
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}