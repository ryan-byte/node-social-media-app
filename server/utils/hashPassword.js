const crypto = require("crypto");

let digestAlgorithm = "sha384";

/**
 * creates a random salt that can be used in hashing.
 * @returns String
 */
function hashSalt(){
    const salt = crypto.randomBytes(16).toString("hex");
    return salt;
}
/**
 * creates a hashed password by using a password and a hashSalt.
 * @param {String} password 
 * @param {String} hashSalt 
 * @returns String: hashed password.
 */
function hashPassword(password,hashSalt){
    let hashedPass = crypto.pbkdf2Sync(password,hashSalt,1000,32,digestAlgorithm).toString("hex");
    return hashedPass;
}

module.exports = {hashPassword,hashSalt};