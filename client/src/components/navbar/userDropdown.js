
function userDropdown({username}){

    function onLogout(ev){
        ev.preventDefault();
    }

    return(
        <div className="btn-group">
            <button type="button" className="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                {username}
            </button>
            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                <li><span className="dropdown-item">profile</span></li>
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