import "../../assets/styles/invitations.css"

import ReceivedInvitations from "./received_Invitations"
import ErrorOutput from "../../components/output/ErrorOutput";
import Loading from "../../components/feedback/Loading";

import useFetch from "../../hooks/useFetch";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { restricted_To_unLoggedUsers } from "../../utils/accessPage";

export default function Invitations(){
    const {data: invitations,error,loading} = useFetch("/user/invitations");
    
    const navigate = useNavigate();
    useEffect(()=>{
        restricted_To_unLoggedUsers(navigate);
    });
    
    return (
        <div className="invitations-container">
            {loading && <Loading />}
            {error && <ErrorOutput message={error}/>}
            {invitations && <ReceivedInvitations invitations={invitations}/>}
        </div>
    )
}