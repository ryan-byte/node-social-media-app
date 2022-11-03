import '../../assets/styles/signin.css'; 
import { ReactComponent as GoBack } from  '../../assets/svg/goBack.svg'; 
import {Link} from "react-router-dom";

function Signin(){
    return( 
        <div className="signFormContainer bg-light">
            <form className='p-3 signForm'>


                <div className="d-flex">
                    
                    <div className="text-start">
                        <Link to={"/"}> <GoBack /> </Link>
                    </div>
                    <div className="text-center flex-fill">
                        <h1>Sign in</h1>
                        <p>Dont have an account ? <Link to={"/signup"}> SignUp </Link> </p>
                    </div>
                </div>

                
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input required type="email" className="form-control" name="email" id="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input required type="password" className="form-control" name = "password" id="password"/>
                </div>
                <button type="submit" className="btn btn-primary">Signin</button>
            </form>
        </div>
    );
}

export default Signin;