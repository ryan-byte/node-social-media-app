import empty_profile from "../../assets/images/emptyProfile.png";


export default function UserImages({userInfoData}){
    const username = userInfoData.username;
    return (
        <div>
            <div className="background-img">
                <p>No image</p>
            </div>
            <div className="pofile-img-container">
                <img src={empty_profile} className="profile-img" alt="profile" />
            </div>
            <div>
                <h1 className="text-center">
                    {username}        
                </h1>
            </div>
        </div>
    )
}