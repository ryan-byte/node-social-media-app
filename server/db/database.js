const {MongoClient,ObjectId} = require("mongodb");
const hashPassword = require("../utils/hashPassword");


const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);
const db = client.db("social-media-app-database");

const usersCollection = db.collection("users");

/**
 * this function gets a user from the database that matches the given email.
 * 
 * @param {string} email required.
 * @param {Object} projection optionnal: choose which column in the database to get, will return everything if left empty.
 * @returns database returned values OR {error}.
 * 
 * @example 
 * email = "example@gmail.com"
 * project = {username:1,password:0,description:1}
 */
async function getUserByEmail(email,projection={}){
    try {
        let output = await usersCollection.findOne({email},{projection});
        return output;
    } catch (error) {
        console.error("\x1b[31m" + "error from database > getUserByEmail: \n"+ "\x1b[0m" + error.message);
        return {error};
    }
}

/**
 * Checks if the given user credentions are right by hashing the password then compares it to the hash stored in the database.
 * 
 * @param {*} email required.
 * @param {*} password required.
 * @returns status code (200,404,500)
 */
async function userSignin(email,password){
    try {
        //get user data
        let user = await getUserByEmail(email,{hashSalt:1,hashedPassword:1,username:1});
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
            let username = user.username;
            return {status:200,userID,username};
        }
        //wrong password
        return {status:404};

    } catch (error) {
        console.error("\x1b[31m" + "error from database > userSignin: \n" + "\x1b[0m" + error.message);
        return {status:500};
    }
}

/**
 * Add a user to the database.
 * 
 * @param {string} username required.
 * @param {string} email required.
 * @param {string} hashedPassword required.
 * @param {string} hashSalt required: salt used to hash the password.
 * @returns status code (201,409,500)
 */
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

module.exports = {userSignup,userSignin};