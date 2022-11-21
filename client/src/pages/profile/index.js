import {useParams} from "react-router-dom";
import useFetch from "../../hooks/useFetch";

import UserInfo from "./userInfo";
import Loading from "../../components/feedback/Loading";
import ErrorOutput from "../../components/output/ErrorOutput";

export default function Profile(){
    const {id} = useParams();
    //make a request to the server with the id params to get user details
    const {data:userInfoData,error,loading} = useFetch("/api/user/profile/"+id);
    

    return (
        <div>
            {loading && <Loading />}
            {userInfoData && <UserInfo userInfoData={userInfoData} />}
            {error && <ErrorOutput message={error}/>}
        </div>
    )
}