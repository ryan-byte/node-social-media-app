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
            
            {/* modal trigger */}
            <div className="text-center">
                <button type="button" className="btn btn-light" data-bs-toggle="modal" data-bs-target="#uploadModal">
                    Upload Image
                </button>
            </div>
            {/* image uploader modal */}
            <div className="modal fade" id="uploadModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="newGameStock" className="form-label">image:</label>
                                    <input required type="file" className="form-control" id="imageFileUpload" name = "imageFileUpload" 
                                        accept="image/png, image/jpeg"/>
                                </div>
                                <small style={{"color":"gray"}}>
                                    Profile images should be: <br />
                                    1MB maximum size <br />
                                    2,048 x 2,048 Maximum pix height and width. <br />
                                    Only JPG and PNG formats are accepted. <br />
                                </small>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary">Upload image</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}