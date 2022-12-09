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
    let {username,email,password} = req.body === undefined ? "" : req.body;
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
    username = username.trim();
    if (username.length === 0){
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

/**
 * 
 * must be called after verifying the current user
 * requires (targetID) to be sent in the body as form urlencoded 
 * 
 * @param {Required} req 
 * @param {Required} res 
 */
async function sendInvitation(req,res){
    //get the current user id
    let userID = res.locals.userID;
    //get taget user
    let {targetID} = req.body;
    let badParams = targetID == undefined ||
                    targetID === ""||
                    typeof targetID !== "string"||
                    userID === targetID;
    if (badParams){
        res.sendStatus(400);
        return;
    }
    //add the invitation request to the database
    let {status,message} = await database.sendInvitationRequest(userID,targetID);
    if (message){
        res.status(status).send(message);
        return;
    }
    res.sendStatus(status);
}

/**
 * 
 * must be called after verifying the current user
 * 
 * @param {Required} req 
 * @param {Required} res 
 * 
 * @example
 * json_Resonpse = {
 *      ids:{},
 *      total:0,
 *      received_invitation:{},
 *      sent_invitation:{}
 * }
 */
async function getUser_Invitations(req,res){
    //get the current user id
    let userID = res.locals.userID;
    //get the received invitation of this user
    let output = await database.getUserFriendsDataById(userID);
    let received_invitation = output.received_invitation;
    //send the data to the client
    if (output.status){
        if (output.error){
            res.status(output.status).send(output.error);
            return;
        }
        res.sendStatus(output.status);
        return;
    }
    res.send(received_invitation);
}

module.exports = {userSignup,userSignin,logout,
                sendInvitation,getUser_Invitations};