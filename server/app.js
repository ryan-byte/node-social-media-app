
//setup
const rootDir = require('path').resolve('./');
require("dotenv").config({path:rootDir+"/config.env"});

const express = require("express");
const routes = require("./routes");
const middleware = require("./middleware");
const apiRoutes = require("./api/apiRoutes");
const apiMiddleware = require("./api/apiMiddleware");

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

//endpoints






//listen for connections
app.listen(PORT,()=>console.log("server is on port " + PORT));