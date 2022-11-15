const crypto = require("crypto");

let digestAlgorithm = "sha384";

function hashPassword(password,key){
    const hashSalt = crypto.randomBytes(16).toString("hex");
    return {hashSalt,hashedPassword:crypto.pbkdf2Sync(password,hashSalt,1000,32,digestAlgorithm).toString("hex")};
}

module.exports = hashPassword;