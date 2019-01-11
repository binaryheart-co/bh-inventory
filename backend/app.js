const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3001;

//Setup
require("./setup/passport");
require("./setup/db");

const auth = require("./routes/auth");
const user = require("./routes/user");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/auth", auth);
app.use("/user", user);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))