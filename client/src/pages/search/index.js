import "../../assets/styles/search.css"

import {useSearchParams, useNavigate} from "react-router-dom";
import { useEffect, useState} from "react";
import FoundUsers from "./foundUsers";
import ErrorOutput from "../../components/output/ErrorOutput";
import Loading from "../../components/feedback/Loading";

import useFetch from "../../hooks/useFetch";

export default function Search(){
    const [searchParams] = useSearchParams();
    const [query,setQuery] = useState(searchParams.get("query"));
    const navigate = useNavigate();

    const {data: users,error,loading} = useFetch("/api/search/user/username/" + query);
    
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
            {users && <FoundUsers usersArray={users}/>}
            {error && <ErrorOutput message={error}/>}
            {loading && <Loading />}
        </div>
    )
}