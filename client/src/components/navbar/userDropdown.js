import {Link} from "react-router-dom";
import { removeLoginCookies } from "../../utils/accessPage";
import myImage from "../../assets/images/emptyProfile.png";


function userDropdown({username,userID}){

    //prepare logout function
    async function onLogout(ev){
        ev.preventDefault();
        await removeLoginCookies();
        window.location.replace("/");
    }

    return(
        <div className="btn-group">
            <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                <img className="navbar-profile-pic" src={myImage} alt="profile" />
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li><Link className="dropdown-item" to={"/profile/"+userID} >Profile</Link></li>
                <li><span className="dropdown-item">Settings</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                    <form onSubmit={onLogout}>
                        <button className="dropdown-item">Logout</button>
                    </form>
                </li>
            </ul>
        </div>
    )
}

export default userDropdown;