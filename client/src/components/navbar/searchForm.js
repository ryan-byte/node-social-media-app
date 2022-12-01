import {useState} from "react";
import {useNavigate} from "react-router-dom";


export default function SearchForm(){
    const [searchQuery,setSearchQuery] = useState("");
    const navigate = useNavigate();

    function onSubmit_search(ev){
        ev.preventDefault();
        let query = searchQuery.trim();
        if (query.length === 0) return;
        navigate({pathname:"/search",search:`?query=${query}`});
    }
    
    return(
        <form onSubmit={onSubmit_search}  >
            <input
                value={searchQuery}
                onChange={(ev)=>setSearchQuery(ev.target.value)} 
                className="nav-search-input px-3 py-1" 
                type="text" 
                placeholder="Search..." />
        </form>
    );
}