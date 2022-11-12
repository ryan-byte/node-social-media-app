const {MongoClient,ObjectId} = require("mongodb");

const mongodbURL = process.env.mongodbURL;
const client = new MongoClient(mongodbURL);



module.exports = {};