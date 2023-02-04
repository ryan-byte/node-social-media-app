const path = require("path");
const admin = require("firebase-admin");
const {v4: uuidv4} = require('uuid');

require('dotenv').config({path: firebaseEnvPath});
const firebaseEnvPath = path.resolve('./firebase.env');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
const imageDir = "images";



async function uploadImage(fileBase64, fileName) {
    //uuid is created to set a permanent url to the uploaded image
    const uuid = uuidv4();
    const storageImagesRef = bucket.file(`${imageDir}/${fileName}`);
    try {
        await storageImagesRef.save(Buffer.from(fileBase64, 'base64'), {
            contentType: "image/jpeg",
            metadata: {
                contentType: "image/jpeg",
                metadata:{
                    firebaseStorageDownloadTokens: uuid
                }
            }
        });
        // return the image URL after uploading
        return await getImageUrl(fileName,uuid);
    } catch (err) {
        return {error: err};
    }
}

async function getImageUrl(fileName,uuid) {
    try {
        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageDir + "/" + fileName)}?alt=media&token=${uuid}`;
    } catch (err) {
        return {error: err};
    }
};

module.exports = {uploadImage}