const firebase = require("./firebase");
const Busboy = require("busboy");


const maxImgUploadSize = 1000000;


/**
 * @param {Request} req express request object
 * @param {Response} res express response object
 * @param {Next} next express next object middleware
 */
async function uploadImageToServer_middleware(req,res,next){
    //this middleware will raise a 400 error code on error
    const bb = Busboy({headers:req.headers,limits:{fileSize:maxImgUploadSize}});
    //setup bb vars
    bb.fileBase64 = "";
    bb.totalSize = 0;
    bb.status = 200;

    bb.on("file",(name,file,info)=>{
        //setup file extention
        const {mimeType} = info;
        let ext = "";
        if (mimeType === "image/jpeg"){
            ext = ".jpg";
        }else if (mimeType === "image/png"){
            ext = ".png";
        }else{
            //a client error status code that indicates that his file mimetype is unaccepted
            bb.status = 415;
        }
        //setup the file meta data
        bb.fileName = randomName() + ext;
        file.setEncoding("base64");

        file.on("data",(chunk)=>{
            if (ext === ".png" || ext === ".jpg"){
                //store all the file base64 in a variable
                bb.fileBase64 += chunk;
            }
        })

        file.on("close",()=>{
            if (file.truncated){
                bb.emit("filesLimit");
            }
        })
    })
    bb.on("filesLimit",()=>{
        bb.status = 413;
    })
    bb.on("close",async ()=>{
        if (bb.fileBase64.length === 0){
            res.sendStatus(400);
            return;
        }
        if (bb.status === 200){
            //save the file to the cloud.
            let imageUrl = await firebase.uploadImage(bb.fileBase64, bb.fileName);
            //save the fileName and fileURL in the response so it can be used later
            res.locals.fileName = bb.fileName;
            res.locals.imageUrl = imageUrl;
            //proceed to the next middleware.
            next();
        }else{
            res.sendStatus(bb.status);
            return;
        }
    })
    req.pipe(bb);
}

function randomName(){
    return Date.now() + '-' + Math.round(Math.random() * 1E9);
}

module.exports = {uploadImageToServer_middleware}