import { Link } from "react-router-dom";

import empty_profile from "../../assets/images/emptyProfile.png";

export default function ReceivedInvitations({invitations}){
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
                            <input type="button" className="invitation-accept" value="Accept" />
                            <input type="button" className="invitation-decline" value="Decline" />
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