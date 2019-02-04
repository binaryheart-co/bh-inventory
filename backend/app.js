//Express
const express = require('express');
const app = express();

//Modules
const bodyParser = require("body-parser");
// const cors = require("cors");
const session = require("express-session");
const passport = require('passport');
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

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
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//API Routes
const router = express.Router();
app.use("/api", router);

const auth = require("./routes/auth");
router.use("/auth", auth);

const user = require("./routes/user");
router.use("/user", user);

const inventory = require("./routes/inventory");
router.use("/inventory", inventory);

app.listen(serverPort, () => console.log(`Example app listening on port ${serverPort}!`))