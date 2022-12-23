
//setup
const rootDir = require('path').resolve('./');
require("dotenv").config({path:rootDir+"/config.env"});

const express = require("express");
const routes = require("./serverRoutes/routes");
const middleware = require("./serverRoutes/middleware");
const apiRoutes = require("./api/apiRoutes");

//Note: make sure to listen with (server.listen) instead of (app.listen) so that the websocket works 
const app = express();
const server = require("http").createServer(app);
const PORT = parseInt(process.env.PORT) || 5000;

app.use(express.urlencoded({ extended: true }));

//adding the chat with socketio
require("./websocket/chat")(server);

//api endpoints
app.get("/api/user/profile/:id",apiRoutes.getUserProfileData);
app.put("/api/user/profile/details",middleware.loggedUsersAccess,apiRoutes.updateUserProfileDetails);

app.put("/api/user/setting/username",middleware.loggedUsersAccess,apiRoutes.updateUsername);
app.put("/api/user/setting/password",middleware.loggedUsersAccess,apiRoutes.updatePassword);

app.post("/api/user/post",middleware.loggedUsersAccess,apiRoutes.createUserPost);

app.get("/api/posts/:userID",apiRoutes.getUserPosts);

app.get("/api/search/user/username/:username",apiRoutes.searchUser);


//route endpoints

app.post("/signup",routes.userSignup);
app.post("/signin",routes.userSignin);

app.get("/logout",routes.logout);

app.post("/invite",middleware.loggedUsersAccess,routes.sendInvitation);
app.get("/user/invitations",middleware.loggedUsersAccess,routes.getUser_Invitations);
app.post("/user/invitations/accept",middleware.loggedUsersAccess,routes.accept_invitation);
app.post("/user/invitations/decline",middleware.loggedUsersAccess,routes.decline_invitation);

app.get("/user/friends",middleware.loggedUsersAccess,routes.getUser_Friends);


//listen for connections (with server instead of app)
server.listen(PORT,()=>console.log("\x1b[32m" + "server is on port " + PORT + "\x1b[0m"));