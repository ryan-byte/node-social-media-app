const database = require("../db/database");
const hashPassword = require("../utils/hashPassword");
const cookieManager = require("../utils/cookieManager");


async function userLogin(req,res){
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
    let {status,userID} = await database.userLogin(email,password);
    
    if (status === 200){
        //give the user a cookie for login
        cookieManager.giveUserLoginCookie(res,userID);
    }
    res.sendStatus(status);
}

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
    }
    res.sendStatus(status);
}



module.exports = {userSignup,userLogin};