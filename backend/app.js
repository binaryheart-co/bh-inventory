const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const passportSetup = require("./passportSetup");
const passportLogin = require("./passportLogin");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Hello World!'));
app.use("/", passportLogin);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))