

export default function General(){

    async function onSubmit_ChangeUsername(ev){
        ev.preventDefault();
        console.log("test");
    }

    return(
        <div>
            <form className="my-4" onSubmit={onSubmit_ChangeUsername}>
                <div className="setting-form-group">
                    <label className="my-2" htmlFor="username">Username</label>
                    <div className = "d-flex">
                        <input type="type" className="setting-form-control" style={{"width":"50%"}} aria-describedby="change username" placeholder="Your username" id ="username" />
                        <button type="submit" className="btn setting-btn-custom-color mx-3">Update</button>
                    </div>
                    <small className="form-text setting-text-muted">Change ur username.</small>
                </div>
            </form>
        </div>
    )
}