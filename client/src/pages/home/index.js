import UserPublish from "../../components/form/userPublish";
import { restricted_To_unLoggedUsers } from "../../utils/accessPage";

import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Posts from "./posts";

function Home(){
    const navigate = useNavigate();

    useEffect(()=>{
        restricted_To_unLoggedUsers(navigate);
    });

    return(
        <div className="mt-3">
            <UserPublish />
            <Posts/>
        </div>
    );
}

export default Home;