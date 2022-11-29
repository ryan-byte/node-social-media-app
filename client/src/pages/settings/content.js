import General from "./general_tab";
import Security from "./security_tab";
import {useEffect,useState} from "react";
import {useSearchParams} from 'react-router-dom';

export default function Content(){
    const [searchParams,setSearchParams] = useSearchParams();
    const [tab,setTab] = useState(null);



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
            {tab === "general" && <General/>}
            {tab === "security" && <Security/>}
        </div>
    );
}