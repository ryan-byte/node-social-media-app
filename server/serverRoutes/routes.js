const database = require("../db/database");
const hashPassword = require("../utils/hashPassword");

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
    const {hashedPassword,hashSalt} = hashPassword(password);
    let {status} = await database.userSignup(username,email,hashedPassword,hashSalt);
    res.sendStatus(status);
}

module.exports = {userSignup};