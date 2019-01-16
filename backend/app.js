const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = require("./config").serverPort;

//Setup
require("./setup/passport");
require("./setup/db");

//Routes
const auth = require("./routes/auth");
const user = require("./routes/user");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
}));

app.use("/auth", auth);
app.use("/user", user);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))