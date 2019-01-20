//Express
const express = require('express');
const app = express();

//Modules
const bodyParser = require("body-parser");
// const cors = require("cors");
const session = require("express-session");
const passport = require('passport');

//Constants
const { serverPort, sessionSecret } = require("./config");

//Setup
require("./setup/passport");
require("./setup/db");

//Bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
// app.use(cors({
//     origin: "http://localhost:3000",
// }));

//Express Session
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, //CHANGE FOR PRODUCTION
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
const auth = require("./routes/auth");
app.use("/auth", auth);

const user = require("./routes/user");
app.use("/user", user);

app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`))