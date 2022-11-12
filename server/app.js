
//setup
const rootDir = require('path').resolve('./');
require("dotenv").config({path:rootDir+"/config.env"});

const express = require("express");
const routes = require("./serverRoutes/routes");
const middleware = require("./serverRoutes/middleware");
const apiRoutes = require("./api/apiRoutes");
const apiMiddleware = require("./api/apiMiddleware");

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

//endpoints






//listen for connections
app.listen(PORT,()=>console.log("\x1b[32m" + "server is on port " + PORT + "\x1b[0m"));