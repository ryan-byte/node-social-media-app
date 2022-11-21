import '../../assets/styles/signin.css'; 
import { ReactComponent as GoBack } from  '../../assets/svg/goBack.svg'; 
import {Link,useNavigate} from "react-router-dom";
import { useState ,useEffect } from 'react';
import {unloggedUsersAccess} from "../../utils/accessPage";

import postData from '../../utils/postData';
import ErrorOutput from '../../components/output/ErrorOutput';
import TextInput from '../../components/form/TextInput';
import PasswordInput from '../../components/form/PasswordInput';
import EmailInput from '../../components/form/EmailInput';
import Loading from '../../components/feedback/Loading';


function Signup(){
    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const [error,setError] = useState(undefined);
    const [loading,setLoading] = useState(false);

    async function onSignup(ev){
        ev.preventDefault();
        let errorMessage = "";
        //start loading feedback
        setLoading(true);
        //check if the inputs are correct
        if (confirmPassword !== password){
            errorMessage += "password and confirm password must be the same\n";
        }
        if (password.length <= 8){
            errorMessage += "password length must be bigger then 8\n";
        }
        if (errorMessage === ""){
            setError(undefined);
        }else{
            setError(errorMessage);
            //end loading feedback
            setLoading(false);
            return;
        }
        //send an api request with useFetch
        let data = {
            username,
            email,
            password,
        };
        let response = await postData("/signup",data);
        
        //do something depending on the response
        if (response.ok){
            navigate("/");
        }else{
            let status = response.status;
            if (status === 409){
                errorMessage = `email already exists`;
            }else{
                errorMessage = `error status code: ${status}\n`;
            }
            setError(errorMessage);
        }

        //end loading feedback
        setLoading(false);
    }

    useEffect(()=>{
        unloggedUsersAccess(navigate);
    });

    return(
        <div className="signFormContainer bg-light">
            <form className='p-3 signForm' onSubmit={onSignup}>
                
                <div className="d-flex">
                    
                    <div className="text-start">
                        <Link to={"/"}> <GoBack /> </Link>
                    </div>
                    <div className="text-center flex-fill">
                        <h1>Sign up</h1>
                        <p>Already have an account ? <Link to={"/signin"}> SignIn </Link> </p>
                    </div>
                </div>


                <TextInput label={"Username"} attributs={"username"} value={username} setValue={setUsername} />
                <EmailInput label={"Email"} attributs={"email"} value={email} setValue={setEmail} />
                <PasswordInput label={"Password"} attributs={"password"} value={password} setValue={setPassword} />
                <PasswordInput label={"Confirm Password"} attributs={"confirmPassword"} value={confirmPassword} setValue={setConfirmPassword} />

                {loading && <Loading />}
                <ErrorOutput message={error}/>

                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    );
}

export default Signup;