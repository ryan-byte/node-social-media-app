import {Link} from "react-router-dom";
import Cookies from "js-cookie";
import UserDropdown from "./userDropdown";

const userCookieName = "user";

function Navbar(){
    let userCookieValue = Cookies.get(userCookieName);
    let userInfo;
    if (userCookieValue){
        userInfo = JSON.parse(userCookieValue);
    }
    
    return (
        <nav className="navbar navbar-expand-lg bg-light sticky-top">
            <div className="container-fluid">
                <span className="navbar-brand" >Prototype</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                    </li>
                    <li className="nav-item">
                        {userInfo === undefined && <Link className="nav-link active" aria-current="page" to="/signin">Signin</Link>}
                    </li>
                </ul>
                
                {userInfo && <UserDropdown username={userInfo.username} userID={userInfo.userID} />}

                </div>
            </div>
        </nav>
    );
}

export default Navbar;