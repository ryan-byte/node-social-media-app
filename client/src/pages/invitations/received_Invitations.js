import { Link } from "react-router-dom";

import empty_profile from "../../assets/images/emptyProfile.png";

import postData from "../../utils/postData";

export default function ReceivedInvitations({invitations}){

    async function acceptUser(ev,acceptedUerID){
        let buttons = ev.target.parentElement.querySelectorAll("input");
        //disable buttons
        buttons.forEach((item) => item.disabled = true);
        
        //send a request to the server for accepting this user
        let data = {
            "accepted_userID": acceptedUerID
        }
        let response = await postData("/user/invitations/accept",data);
        if (response.ok){
            //delete user from the invitation page
            ev.target.parentElement.parentElement.remove();
        }else{
            //show error 

            //enable buttons
            buttons.forEach((item) => item.disabled = false);
        }
    }

    async function declineUser(ev,declinedUerID){
        let buttons = ev.target.parentElement.querySelectorAll("input");
        //disable buttons
        buttons.forEach((item) => item.disabled = true);
        
        //send a request to the server for accepting this user
        let data = {
            "declined_userID": declinedUerID
        }
        let response = await postData("/user/invitations/decline",data);
        if (response.ok){
            //delete user from the invitation page
            ev.target.parentElement.parentElement.remove();
        }else{
            //show error 

            //enable buttons
            buttons.forEach((item) => item.disabled = false);
        }
    }

    function renderInvitations(invitations){
        let elementsArray = [];
        for (const id in invitations){
            elementsArray.push(
                    <div 
                    className="invitations-user-holder" 
                    key={id} >
                        <Link to={"/profile/"+id}>
                            <img 
                                className="user-post-profile-image invitation-user-link" 
                                src={empty_profile} 
                                alt= {invitations[id].username + " profile"}/>
                        </Link>
                        <Link to={"/profile/"+id} className="ms-2 invitation-user-link" style={{color:"black",textDecoration:"none"}}>
                            {invitations[id].username}
                        </Link>
                        <div className="invitation-buttons">
                            <input 
                                type="button" 
                                className="invitation-accept" 
                                value="Accept"
                                onClick={(ev) => acceptUser(ev,id)} />
                            <input 
                                type="button" 
                                className="invitation-decline" 
                                value="Decline" 
                                onClick={(ev) => declineUser(ev,id)} />
                        </div>
                    </div>
            )
        }
        return elementsArray;
    }

    return (
        <div>
            {renderInvitations(invitations)}
        </div>
    )
}