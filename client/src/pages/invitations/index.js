import "../../assets/styles/invitations.css"

import ReceivedInvitations from "./received_Invitations"

export default function Invitations(){
    
    const users = [
        {
            _id:0,
            username:"hmid"
        },
        {
            _id:1,
            username:"hgel"
        },
        {
            _id:2,
            username:"qs"
        }
    ]
    return (
        <div className="invitations-container">
            {users && <ReceivedInvitations usersArray={users}/>}
        </div>
    )
}