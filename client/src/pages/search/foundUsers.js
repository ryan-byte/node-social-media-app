import empty_profile from "../../assets/images/emptyProfile.png";

export default function FoundUsers(){
    let usersArray = [{username:"user1",id:1},{username:"user2",id:2},{username:"user3",id:3},{username:"user4",id:4}]
    return (
        <div>
            {
                usersArray.map((user)=>
                    <div className="search-user-holder" key={user.id}>
                        <img 
                            className="user-post-profile-image" 
                            src={empty_profile} 
                            alt= {user.username + " profile"} />
                        <div className="ms-2">                                
                            {user.username}
                        </div>
                    </div>
                )
            }
        </div>
    )
}