const crypto = require("crypto");

let digestAlgorithm = "sha384";

function hashSalt(){
    const salt = crypto.randomBytes(16).toString("hex");
    return salt;
}

function hashPassword(password,hashSalt){
    let hashedPass = crypto.pbkdf2Sync(password,hashSalt,1000,32,digestAlgorithm).toString("hex");
    return hashedPass;
}

module.exports = {hashPassword,hashSalt};