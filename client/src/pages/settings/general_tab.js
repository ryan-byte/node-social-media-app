import {useState} from "react"
import ErrorOutput from "../../components/output/ErrorOutput";
import postData from "../../utils/postData";
import Loading from "../../components/feedback/Loading";

export default function General({usernameInCookie}){
    const [username,setUsername] = useState("");
    const [username_placeholder,setUsername_placeholder] = useState(usernameInCookie);
    const [error,setError] = useState(undefined);
    const [loading,setLoading] = useState(false);

    async function onSubmit_ChangeUsername(ev){
        ev.preventDefault();
        setError(undefined);

        //start feedback
        setLoading(true);

        let data = {username};
        let request = await postData("/api/user/setting/username",data,"PUT");
        if (request.ok){
            setUsername_placeholder(username)
            setUsername("");
        }else{
            setError("an error occured!");
        }
        document.activeElement.blur();

        //stop loading
        setLoading(false);
    }

    return(
        <div>
            <form className="my-4" onSubmit={onSubmit_ChangeUsername}>
                <div className="setting-form-group">
                    <label className="my-2" htmlFor="username">Username</label>
                    <div className = "d-flex">
                    </div>
                    <input 
                        type="type" 
                        className="setting-form-control form-control" 
                        style={{"width":"50%"}} 
                        aria-describedby="change username" 
                        placeholder={username_placeholder}
                        
                        value={username}
                        onChange={(ev)=>setUsername(ev.target.value)}/>
                    <div>
                        <small className="form-text setting-text-muted">Change username.</small>
                    </div>

                    <div style={{"width":"50%"}}>
                        {error && <ErrorOutput message={error} />}
                        {loading && <Loading />}
                    </div>

                    <button type="submit" className="btn setting-btn-custom-color mt-3">Update Username</button>
                </div>
            </form>
        </div>
    )
}