import { removeLoginCookies } from "../../utils/accessPage";


function userDropdown({username}){

    async function onLogout(ev){
        ev.preventDefault();
        await removeLoginCookies();
        window.location.replace("/");
    }

    return(
        <div className="btn-group">
            <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {username}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li><span className="dropdown-item">Profile</span></li>
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