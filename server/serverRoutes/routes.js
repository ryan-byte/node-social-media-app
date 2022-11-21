const database = require("../db/database");
const hashPassword = require("../utils/hashPassword");
const cookieManager = require("../utils/cookieManager");

/**
 * a route for verifying if the given user credentials are true, 
 * if true then gives the client a login cookie.
 * @param {*} req 
 * @param {*} res 
 * @returns status code
 */
async function userSignin(req,res){
    //must be called after a middleware that verify if the user is not logged in
    //email and password must be sent from urlencoded form
    const {email,password} = req.body === undefined ? "" : req.body;
    let condition = email === ""||
                    typeof email === "undefined"||
                    password === ""||
                    typeof password === "undefined";
    if (condition){
        res.sendStatus(400);
        return;
    }
    //check if the data is correct from the database
    let {status,userID,username} = await database.userSignin(email,password);
    
    if (status === 200){
        //give the user a cookie for login
        cookieManager.giveUserLoginCookie(res,userID);
        cookieManager.giveUserLoginInfoCookie(res,{username,userID});
    }
    res.sendStatus(status);
}

/**
 * a route for adding a user to the database then gives the client a login cookie.
 * @param {*} req 
 * @param {*} res 
 * @returns status code
 */
async function userSignup(req,res){
    //must be called after a middleware that verify if the user is not logged in
    //username, email and password must be sent from urlencoded form
    const {username,email,password} = req.body === undefined ? "" : req.body;
    let condition = username === ""||
                    typeof username === "undefined"||
                    email === ""||
                    typeof email === "undefined"||
                    password === ""||
                    password.length < 8||
                    typeof password === "undefined";
    if (condition){
        res.sendStatus(400);
        return;
    }
    //save the user data in the database
    const hashSalt = hashPassword.hashSalt();
    const hashedPassword = hashPassword.hashPassword(password,hashSalt);
    let {status,userID} = await database.userSignup(username,email,hashedPassword,hashSalt);
    
    if (status === 201){
        //give the user a cookie for login
        cookieManager.giveUserLoginCookie(res,userID);
        cookieManager.giveUserLoginInfoCookie(res,{username,userID});
    }
    res.sendStatus(status);
}

/**
 * removes the cookies used for authentication
 * @param {*} req 
 * @param {*} res 
 */
function logout(req,res){
    cookieManager.removeLoginCookie(res);
    res.sendStatus(200);
}

module.exports = {userSignup,userSignin,logout};