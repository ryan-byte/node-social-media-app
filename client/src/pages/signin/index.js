import '../../assets/styles/signin.css'; 
import { ReactComponent as GoBack } from  '../../assets/svg/goBack.svg'; 
import {Link,useNavigate} from "react-router-dom";
import { useState ,useEffect } from 'react';
import {restricted_To_LoggedUsers} from "../../utils/accessPage";

import postData from '../../utils/postData';
import ErrorOutput from '../../components/output/ErrorOutput';
import PasswordInput from '../../components/form/PasswordInput';
import EmailInput from '../../components/form/EmailInput';
import Loading from '../../components/feedback/Loading';
import {UpdateFriends} from '../../utils/FriendsObject';


function Signin(){
    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const [error,setError] = useState(undefined);
    const [inputsErrors,setInputsErrors] = useState({});
    const [loading,setLoading] = useState(false);


    async function onSignin(ev){
        ev.preventDefault();
        
        //check if the inputs are correct
        if (!validateForm()){
            return;
        }


        //start loading feedback
        setLoading(true);
        
        //send an api request
        let data = {
            email,
            password,
        };
        let response = await postData("/signin",data);
        
        //do something depending on the response
        if (response.ok){
            await UpdateFriends();
            navigate("/")
        }else{
            let errorMessage = "";
            let status = response.status;
            if (status === 404){
                errorMessage = `User not found`;
            }else{
                errorMessage = `error status code: ${status}\n`;
            }
            setError(errorMessage);
        }

        //end loading feedback
        setLoading(false);
    }

    const validateForm = () => {
        let newErrors = {};
        let valid = true;

        //email verification
        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
            valid = false;
        }

        //password verification
        if (!password) {
            newErrors.password = "Password is required";
            valid = false;
        }

        //set the new error
        setInputsErrors(newErrors);
        return valid;
    };



    useEffect(()=>{
        restricted_To_LoggedUsers(navigate);
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

                
                <EmailInput label={"Email"} attributs={"email"} value={email} 
                        setValue={setEmail} 
                        error={inputsErrors.email}/>

                <PasswordInput label={"Password"} attributs={"password"} value={password} 
                        setValue={setPassword} 
                        error={inputsErrors.password}/>

                {loading && <Loading />}
                <ErrorOutput message={error}/>


                <button type="submit" className="btn btn-primary">Signin</button>
            </form>
        </div>
    );
}

export default Signin;