import "../../assets/styles/profile.css"
import "../../assets/styles/posts.css"

import {useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import UserInfo from "./userInfo";
import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";
import UserImages from "./userImages";
import UserContent from "./userContent";
import UserPublish from "./userPublish";


export default function Profile(){
    const {id} = useParams();
    //make a request to the server with the id params to get user details
    const {data:userInfoData,error,loading} = useFetch("/api/user/profile/"+id);
    

    return (
        <div>
            {userInfoData && <UserImages userInfoData={userInfoData}/>}
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            {userInfoData && <UserInfo userInfoData={userInfoData} />}
            <UserPublish />
            <UserContent />
        </div>
    )
}