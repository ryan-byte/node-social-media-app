

export default function Security(){

    async function onSubmit_ChangeUsername(ev){
        ev.preventDefault();
        console.log("test");
    }

    return(
        <div>
            <form className="my-4" onSubmit={onSubmit_ChangeUsername}>
                <div className="setting-form-group">
                    <label className="my-2 form-label" htmlFor="oldPassword">Old Password</label>
                    <input 
                        id="oldPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the old password" />

                    <label className="my-2 form-label" htmlFor="newPassword">New Password</label>
                    <input 
                        id="newPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the new password" />


                    <label className="my-2 form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input 
                        id="confirmNewPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the new again password" />
                    
                    
                    <br />                    
                    <button type="submit" className="btn setting-btn-custom-color">Update Password</button>
                </div>
            </form>
        </div>
    )
}