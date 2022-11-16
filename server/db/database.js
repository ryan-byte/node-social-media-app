const {MongoClient,ObjectId} = require("mongodb");
const hashPassword = require("../utils/hashPassword");


const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);
const db = client.db("social-media-app-database");

const usersCollection = db.collection("users");

async function getUserByEmail(email,projection={}){
    try {
        let output = await usersCollection.findOne({email},{projection});
        return output;
    } catch (error) {
        console.error("\x1b[31m" + "error from database > getUserByEmail: \n"+ "\x1b[0m" + error.message);
        return {error};
    }
}

async function userLogin(email,password){
    try {
        //get user data
        let user = await getUserByEmail(email,{hashSalt:1,hashedPassword:1});
        if (user === null){
            //user doesnt exists
            return {status:404};
        }
        //verify the given password
        let hashSalt = user.hashSalt;
        let hashedPassword = user.hashedPassword;
        let unverifiedHashedPassword = hashPassword.hashPassword(password,hashSalt);

        if (hashedPassword === unverifiedHashedPassword){
            //correct password
            let userID = user._id.toString();
            return {status:200,userID};
        }
        //wrong password
        return {status:404};

    } catch (error) {
        console.error("\x1b[31m" + "error from database > userLogin: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

async function userSignup(username,email,hashedPassword,hashSalt){
    try {
        //check if the user exists already
        let userExist = await getUserByEmail(email);
        if (userExist === null){
            //user doesnt exist
            //save his data
            let timeStamp = Math.floor(Date.now() / 1000);
            let userID = (await usersCollection.insertOne({username,email,hashedPassword,hashSalt,timeStamp})).insertedId.toString();
            return {status:201,userID};
        }else{
            //throw an error if the get user has thrown an error
            if (userExist.error !== undefined) return {status:500};
            //user already exist
            return {status:409};
        }
    } catch (error) {
        console.error("\x1b[31m" + "error from database > userSignup: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

module.exports = {userSignup,userLogin};