import { ReactComponent as GeneralSVG } from  '../../assets/svg/Setting.svg';
import { ReactComponent as SecuritySVG } from  '../../assets/svg/Security.svg';
import {Link} from 'react-router-dom';
import {useEffect,useState} from "react";
import {useSearchParams} from 'react-router-dom';

export default function Sidebar(){

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
        <div className="sidebar">
            <Link className={tab === "general" ? "active" : ""} to="?tab=general"> 
                <GeneralSVG className="small-icon"/> 
                <span> General</span>
            </Link>
            <Link className={tab === "security" ? "active" : ""} to="?tab=security"> 
                <SecuritySVG className="small-icon"/> 
                <span> Security</span>
            </Link>
        </div>
    )
}