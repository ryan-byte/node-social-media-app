import General from "./general_tab";
import Security from "./security_tab";
import {useEffect,useState} from "react";
import {useSearchParams} from 'react-router-dom';
import { getLoginCookieData } from "../../utils/accessPage";

export default function Content(){
    const [searchParams,setSearchParams] = useSearchParams();
    const [tab,setTab] = useState(null);

    const {username : usernameInCookie} = getLoginCookieData();


    useEffect(()=>{
        const availableTabs = ["general","security"];
        let currentTab = searchParams.get("tab");
        setTab(currentTab);
        if (!availableTabs.includes(currentTab)){
            setSearchParams({"tab":"general"});
        }
    },[searchParams,setSearchParams]);
    
    return (
        <div className="content">
            {tab === "general" && <General usernameInCookie={usernameInCookie} />}
            {tab === "security" && <Security />}
        </div>
    );
}