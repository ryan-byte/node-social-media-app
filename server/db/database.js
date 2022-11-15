const {MongoClient,ObjectId} = require("mongodb");


const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);
const db = client.db("social-media-app-database");

const usersCollection = db.collection("users");

async function getUserByEmail(email){
    try {
        let output = await usersCollection.findOne({email});
        return output;
    } catch (error) {
        console.error("error from getUserByEmail: \n"+ error.message);
        return {error};
    }
}

async function userSignup(username,email,hashedPasword,hashSalt){
    try {
        //check if the user exists already
        let userExist = await getUserByEmail(email);
        if (userExist === null){
            //user doesnt exist
            //save his data
            let timeStamp = Math.floor(Date.now() / 1000);
            usersCollection.insertOne({username,email,hashedPasword,hashSalt,timeStamp});
            return {status:200};
        }else{
            //throw an error if the get user has thrown an error
            if (userExist.error !== undefined) throw "error from getUserByEmail: \n"+userExist.error;
            //user already exist
            return {status:409};
        }
    } catch (error) {
        console.error("error from userSignup: \n"+ error.message);
        return {status:500};
    }
}

module.exports = {userSignup};