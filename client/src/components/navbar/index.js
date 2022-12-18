import {Link,useNavigate} from "react-router-dom";
import Cookies from "js-cookie";
import UserDropdown from "./userDropdown";
import {useEffect,useState} from "react";
import '../../assets/styles/navbar.css';

import SearchForm from "./searchForm";

const userCookieName = "user";

function Navbar(){
    const navigate = useNavigate();
    const [pathName,setPathName] = useState(undefined);

    //getting userInfo
    let userCookieValue = Cookies.get(userCookieName);
    let userInfo;
    if (userCookieValue){
        userInfo = JSON.parse(userCookieValue);
    }

    useEffect(() => {
        setPathName(window.location.pathname);
    },[navigate]) 
    
    return (
        <nav className="navbar navbar-expand-lg navbar-bg sticky-top">
            <div className="container-fluid">
                <span className="navbar-brand" >Prototype</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <SearchForm />

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className={pathName === "/" ? "nav-link active":"nav-link"} aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        {userInfo === undefined && <Link className="nav-link" aria-current="page" to="/signin">Signin</Link>}
                    </li>
                    <li className="nav-item">
                        {userInfo && <Link className={pathName === "/invitations" ? "nav-link active":"nav-link"} aria-current="page" to="/invitations">Invitations</Link>}
                    </li>
                </ul>
                
                {userInfo && <UserDropdown userID={userInfo.userID} />}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;