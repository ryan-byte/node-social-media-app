import empty_profile from "../../assets/images/emptyProfile.png";

export default function UserPublish(){

    async function onSubmitPost(ev){
        ev.preventDefault();
    }

    return (
        <div className="user-publish-container">
            <form className="user-publish-form" onSubmit={onSubmitPost}>
                <img src={empty_profile} alt="profile" className="user-post-profile-image"/>
                <input className="user-publish-form-text" type="text" name="post" placeholder="What are you thinking about ?" />
                <input className="user-publish-form-submit" type="submit" value="Publish" />
            </form>
        </div>
    );
}