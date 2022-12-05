import "../../assets/styles/search.css"

import {useSearchParams, useNavigate} from "react-router-dom";
import { useEffect, useState} from "react";
import FoundUsers from "./foundUsers";


export default function Search(){
    const [searchParams] = useSearchParams();
    const [query,setQuery] = useState("");
    const navigate = useNavigate();


    useEffect(()=>{
        let searchQuery = searchParams.get("query");
        if (searchQuery){
            setQuery(searchQuery.trim());
        }else{
            navigate("/404");
        }
    },[searchParams,navigate])

    return (
        <div className="search-container">
            <div className="search-query">
                Search : "{query}"
            </div>
            <FoundUsers />
        </div>
    )
}