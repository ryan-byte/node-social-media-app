
export default function UserInfo({userInfoData}){
    console.log(userInfoData);
    const username = userInfoData.username;
    const details = userInfoData.details;
    return(
        <div>
            username:{username}
            <br />
            details:{details}
        </div>
    )
}