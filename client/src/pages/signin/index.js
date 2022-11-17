import '../../assets/styles/signin.css'; 
import { ReactComponent as GoBack } from  '../../assets/svg/goBack.svg'; 
import {Link,useNavigate} from "react-router-dom";
import { useState ,useEffect } from 'react';

import Cookies from "js-cookie"
import postData from '../../utils/postData';
import ErrorOutput from '../../components/output/ErrorOutput';
import PasswordInput from '../../components/form/PasswordInput';
import EmailInput from '../../components/form/EmailInput';



const userCookieName = "user"


function Signin(){
    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState(undefined);


    async function onSignin(ev){
        ev.preventDefault();
        let errorMessage = "";
        //check if the inputs are correct
        if (password.length <= 8){
            errorMessage += "password length must be bigger then 8\n";
        }
        if (errorMessage === ""){
            setError(undefined);
        }else{
            setError(errorMessage);
            return;
        }
        //send an api request with useFetch
        let data = {
            email,
            password,
        };
        let response = await postData("/signin",data);
        
        //do something depending on the response
        if (response.ok){
            navigate("/");
        }else{
            let status = response.status;
            errorMessage = `error status code: ${status}\n`;
            if (status === 401){
                errorMessage += `you are already logged in`;
            }
            setError(errorMessage);
        }
    }

    useEffect(()=>{
        let userCookieValue = Cookies.get(userCookieName);
        if (userCookieValue){
            navigate("/");
        }
    });


    return( 
        <div className="signFormContainer bg-light">
            <form className='p-3 signForm' onSubmit={onSignin}>


                <div className="d-flex">
                    
                    <div className="text-start">
                        <Link to={"/"}> <GoBack /> </Link>
                    </div>
                    <div className="text-center flex-fill">
                        <h1>Sign in</h1>
                        <p>Dont have an account ? <Link to={"/signup"}> SignUp </Link> </p>
                    </div>
                </div>

                
                <EmailInput label={"Email"} attributs={"email"} value={email} setValue={setEmail} />
                <PasswordInput label={"Password"} attributs={"password"} value={password} setValue={setPassword} />

                <ErrorOutput message={error}/>


                <button type="submit" className="btn btn-primary">Signin</button>
            </form>
        </div>
    );
}

export default Signin;