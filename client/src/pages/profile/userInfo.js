
export default function UserInfo({userInfoData}){
    const username = userInfoData.username;
    const aboutMe = userInfoData.details ? userInfoData.details.aboutMe : "";
    return(
        <div>
            username:{username}
            <br />
            aboutMe:{aboutMe}
        </div>
    )
}