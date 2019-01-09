const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const passportSetup = require("./passport");
const passportLogin = require("./auth");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Hello World!'));
app.use("/", passportLogin);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))