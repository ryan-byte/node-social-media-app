
//setup
const rootDir = require('path').resolve('./');
require("dotenv").config({path:rootDir+"/config.env"});

const express = require("express");
const routes = require("./serverRoutes/routes");
const middleware = require("./serverRoutes/middleware");
const apiRoutes = require("./api/apiRoutes");

const app = express();
const PORT = parseInt(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: true }));

//api endpoints
app.get("/api/user/profile/:id",apiRoutes.getUserProfileData);
app.put("/api/user/profile/details",middleware.loggedUsersAccess,apiRoutes.updateUserProfileDetails);

app.put("/api/user/setting/username",middleware.loggedUsersAccess,apiRoutes.updateUsername);
app.put("/api/user/setting/password",middleware.loggedUsersAccess,apiRoutes.updatePassword);

app.post("/api/user/post",middleware.loggedUsersAccess,apiRoutes.createUserPost);

app.get("/api/posts/:userID",apiRoutes.getUserPosts);

app.get("/api/search/user/username/:username",apiRoutes.searchUser);


//route endpoints
app.post("/test",(req,res)=>{
    console.log(req.body);
    res.sendStatus(200);
})

app.post("/signup",routes.userSignup);
app.post("/signin",routes.userSignin);

app.get("/logout",routes.logout);

app.post("/invite",middleware.loggedUsersAccess,routes.sendInvitation);
app.get("/user/invitations",middleware.loggedUsersAccess,routes.getUser_Invitations);


//listen for connections
app.listen(PORT,()=>console.log("\x1b[32m" + "server is on port " + PORT + "\x1b[0m"));