import '../../assets/styles/signin.css'; 
import { ReactComponent as GoBack } from  '../../assets/svg/goBack.svg'; 
import {Link,useNavigate} from "react-router-dom";
import { useState ,useEffect } from 'react';
import {restricted_To_LoggedUsers} from "../../utils/accessPage";

import ErrorOutput from '../../components/output/ErrorOutput';
import postData from '../../utils/postData';
import TextInput from '../../components/form/TextInput';
import PasswordInput from '../../components/form/PasswordInput';
import EmailInput from '../../components/form/EmailInput';
import Loading from '../../components/feedback/Loading';
import { UpdateFriends } from '../../utils/FriendsObject';


function Signup(){
    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");

    const [error,setError] = useState(undefined);
    const [inputsErrors,setInputsErrors] = useState({});
    const [loading,setLoading] = useState(false);

    async function onSignup(ev){
        ev.preventDefault();

        //check if the inputs are correct
        if (!validateForm()){
            return;
        }

        //start loading feedback
        setLoading(true);
        
        //send an api request with useFetch
        let data = {
            username,
            email,
            password,
        };
        let response = await postData("/signup",data);
        
        //do something depending on the response
        if (response.ok){
            await UpdateFriends();
            navigate("/");
        }else{
            let errorMessage;
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

    const validateForm = () => {
        let newErrors = {};
        let valid = true;

        //username verification
        if (!username) {
            newErrors.username = 'Username is required';
            valid = false;
        }

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
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&*])(?=.{8,})/.test(password)) {
            newErrors.password = "Please enter a strong password (at least 8 characters, including uppercase, lowercase, number, and special characters)";
            valid = false;
        }

        //confirmPassword verification
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
            valid = false;
        } else if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Confirm Password must be the same as password';
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


                <TextInput label={"Username"} attributs={"username"} value={username} 
                        setValue={setUsername} 
                        error={inputsErrors.username} />

                <EmailInput label={"Email"} attributs={"email"} value={email} 
                        setValue={setEmail} 
                        error={inputsErrors.email} />

                <PasswordInput label={"Password"} attributs={"password"} value={password} 
                        setValue={setPassword} 
                        error={inputsErrors.password} />

                <PasswordInput label={"Confirm Password"} attributs={"confirmPassword"} value={confirmPassword} 
                        setValue={setConfirmPassword} 
                        error={inputsErrors.confirmPassword} />

                {loading && <Loading />}
                {error && <ErrorOutput message={error} />}

                <button type="submit" className="btn btn-primary">Signup</button>
            </form>
        </div>
    );
}

export default Signup;