import { UpdateFriends} from "../../utils/FriendsObject"

import postData from "../../utils/postData";

export default function Interact({userInfoData,ownerProfileVisited,currentUser_Friends}){
    let targetUserID = userInfoData["_id"];

    async function inviteUser(ev,targetUserID){
        let buttons = ev.target.parentElement.querySelectorAll("input");
        //disable buttons
        buttons.forEach((item) => item.disabled = true);
        
        //send a request to the server for accepting this user
        let data = {
            "targetID": targetUserID
        }
        let response = await postData("/invite",data);
        if (response.ok){
            //get the new friends object
            await UpdateFriends();
            //reload 
            window.location.reload(false);
        }else{
            //show error 

            //enable buttons
            buttons.forEach((item) => item.disabled = false);
        }
    }

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
            //get the new friends object
            await UpdateFriends();
            //reload 
            window.location.reload(false);
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
            //get the new friends object
            await UpdateFriends();
            //reload 
            window.location.reload(false);
        }else{
            //show error 

            //enable buttons
            buttons.forEach((item) => item.disabled = false);
        }
    }


    function renderInvitationButton(){
        let areAlreadyFriends = targetUserID in currentUser_Friends["ids"];
        let friendRequestSent = targetUserID in currentUser_Friends["sent_invitation"];
        let friendRequestReceived = targetUserID in currentUser_Friends["received_invitation"];

        let type = "";
        if (areAlreadyFriends){
            type = "friends";
        }else if (friendRequestReceived){
            type = "receivedRequest";
        }else if (friendRequestSent){
            type = "sentRequest";
        }
        switch (type) {
            case "friends":
                return (
                    <span className="profile-interact-button low-brightness" value="Friends">Friends</span>
                );
            case "sentRequest":
                return (
                    <span className="profile-interact-button low-brightness" value="Sent">Sent</span>
                );
            case "receivedRequest":
                return (
                    <div>
                        <input 
                            className="btn btn-primary mx-2"
                            type="button"  
                            value="Accept" 
                            onClick={(ev) => acceptUser(ev,targetUserID)} />
                        <input 
                            className="btn btn-danger mx-2"
                            type="button" 
                            value="Decline" 
                            onClick={(ev) => declineUser(ev,targetUserID)} />
                    </div>
                );
            default:
                return (
                    <input 
                        className="profile-interact-button"
                        type="button" 
                        value="Invite" 
                        onClick={(ev) => inviteUser(ev,targetUserID)} />
                );
        }
    }

    return (
    <div className="pofile-interaction-Container">
        {
            !ownerProfileVisited 
            && 
            <div className="pofile-interaction">
                {renderInvitationButton()}
            </div>    
        }
    </div>
    )
}