import {useState,useEffect} from "react";
import postData from "../../utils/postData";
import ErrorOutput from "../../components/output/ErrorOutput";


export default function UserInfo({userInfoData,ownerProfileVisited}){

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
            setError(undefined);
            let data = {aboutMe};
            let request = await postData("/api/user/profile/details",data,"PUT");
            if (!request.ok){
                setError("an error occured!");
            }
            document.activeElement.blur();
        }
    }

    return(
        <div>
            <div>
                {
                    ownerProfileVisited ?
                    <div>
                        <div className="d-flex justify-content-center"> 
                            {error && <ErrorOutput message = {error}/>}
                        </div>
                        <form onKeyDown={editAboutMe} className="text-center pofile-aboutMe-Container">
                            <textarea className="form-control profile-aboutMe position-absolute top-50 start-50 translate-middle" onChange={(ev)=>{setAboutMe(ev.target.value);}} maxLength="70" value={aboutMe} rows="3"></textarea>
                        </form>
                    </div>
                     :
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