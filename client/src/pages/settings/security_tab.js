import {useState} from "react";
import ErrorOutput from "../../components/output/ErrorOutput";
import postData from "../../utils/postData";
import Loading from "../../components/feedback/Loading";


export default function Security(){
    const [oldPassword,setOldPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [confirmNewPassword,setConfirmNewPassword] = useState("");
    const [error,setError] = useState(undefined);
    const [loading,setLoading] = useState(false);

    async function onSubmit_ChangePassword(ev){
        ev.preventDefault();
        //start loading
        setLoading(true);
        setError(undefined);
        if (newPassword !== confirmNewPassword){
            setLoading(false);
            setError("New password must be the same as confirm password!");
            return;
        }
        if (newPassword.length < 8){
            setLoading(false);
            setError("The new password must be longer then 8");
            return;
        }
        let data = {
            "oldpassword":oldPassword,
            "password":newPassword
        };
        let request = await postData("/api/user/setting/password",data,"PUT");
        if (request.ok){
            //empty the inputs and remove the focus
            setOldPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            document.activeElement.blur();
        }else{
            setError("an error occured");
        }
        //stop loading
        setLoading(false);
    }

    return(
        <div>
            <form className="my-4" onSubmit={onSubmit_ChangePassword}>
                <div className="setting-form-group">
                    <label className="my-2 form-label" htmlFor="oldPassword">Old Password</label>
                    <input 
                        value={oldPassword}
                        onChange={(ev)=>setOldPassword(ev.target.value)}
                        id="oldPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the old password" />

                    <label className="my-2 form-label" htmlFor="newPassword">New Password</label>
                    <input 
                        value={newPassword}
                        onChange={(ev)=>setNewPassword(ev.target.value)}
                        id="newPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the new password" />


                    <label className="my-2 form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input 
                        value={confirmNewPassword}
                        onChange={(ev)=>setConfirmNewPassword(ev.target.value)}
                        id="confirmNewPassword"
                        type="password" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="type the new again password" />
                    
                    
                    <div className="mt-3" style={{"width":"50%"}}>
                        {error && <ErrorOutput message={error} />}
                        {loading && <Loading />}
                    </div>
                    <button type="submit" className="btn setting-btn-custom-color mt-3">Update Password</button>
                </div>
            </form>
        </div>
    )
}