const path = require("path");
const admin = require("firebase-admin");
const {v4: uuidv4} = require('uuid');

const firebaseEnvPath = path.resolve('./firebase.env');
require('dotenv').config({path: firebaseEnvPath});
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = admin.storage().bucket();
const imageDir = "images";


/**
 * saves an image to the firebase storage
 * @param {Object} fileBase64 file in base64 format
 * @param {String} fileName
 * @returns image url on success or {error} on fail
 */
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

/**
 * deletes an image from the firebase storage
 * @param {String} fileName 
 * @returns nothing on success or {error} on fail
 */
async function deleteImage(fileName){
    const storageImagesRef = bucket.file(`${imageDir}/${fileName}`);
    try {
        await storageImagesRef.delete();
    } catch (err) {
        return {error: err};
    }
}

/**
 * gets the image url by providing the filename and the uuid that has been used to store the image
 * @param {String} fileName 
 * @param {uuidv4} uuid the uuid used to store the image
 * @returns 
 */
async function getImageUrl(fileName,uuid) {
    try {
        return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageDir + "/" + fileName)}?alt=media&token=${uuid}`;
    } catch (err) {
        return {error: err};
    }
};

module.exports = {uploadImage, deleteImage}