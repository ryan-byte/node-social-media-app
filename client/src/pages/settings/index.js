import Sidebar from "./sidebar"
import Content from "./content"
import "../../assets/styles/settings.css"

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { restricted_To_unLoggedUsers } from "../../utils/accessPage";

export default function Settings(){
    const navigate = useNavigate();
    useEffect(()=>{
        restricted_To_unLoggedUsers(navigate);
    });

    return (
        <div >
            <Sidebar />
            <Content />
        </div>
    )
}