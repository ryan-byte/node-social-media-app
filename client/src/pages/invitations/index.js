import "../../assets/styles/invitations.css"

import ReceivedInvitations from "./received_Invitations"
import ErrorOutput from "../../components/output/ErrorOutput";
import Loading from "../../components/feedback/Loading";

import useFetch from "../../hooks/useFetch";

export default function Invitations(){
    const {data: invitations,error,loading} = useFetch("/user/invitations");
    
    return (
        <div className="invitations-container">
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            {invitations && <ReceivedInvitations invitations={invitations}/>}
        </div>
    )
}