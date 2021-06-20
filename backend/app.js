//Express
const express = require('express');
const app = express();

//Modules
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require('passport');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const path = require("path");
const helmet = require("helmet");

//Constants
const { serverPort, dbURL } = require("./config");
const isProduction = process.env.NODE_ENV === "production";

//Helmet - for security
app.use(helmet());

//Setup
require("./setup/passport");
require("./setup/db");

//Bodyparser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Trust HTTP headers from Nginx are authentic
if(isProduction) {
    app.set("trust proxy", true);
}

//Express Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: "session1",
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: isProduction,
        httpOnly: isProduction,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        domain: isProduction ? "binaryheart.org" : undefined,
        sameSite: isProduction,
    },
    store: MongoStore.create({ mongoUrl: dbURL }),
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static files from React build
app.use(express.static(path.join(__dirname, "../frontend/build")));

//API Routes
const router = express.Router();
app.use("/api", router);

const auth = require("./routes/auth");
router.use("/auth", auth);

const user = require("./routes/user");
router.use("/user", user);

const devices = require("./routes/devices");
router.use("/devices", devices);

const tasks = require("./routes/tasks");
router.use("/tasks", tasks);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
})

app.use(function(err, req, res, next) {
    if(err.validation) {
        return res.status(err.code ? err.code : 400).json({errors: err.validation});
    }
    else if (err.msg && err.code) {
        return res.status(err.code).json({errors: [{msg: err.msg}]});
    }
    return res.status(500).json({errors: [{msg: "There was a server error :("}]});
});

app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`))