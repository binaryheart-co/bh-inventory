const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const secret = "secret"
const UserModel = require('./models/user');

const router = express.Router();

mongoose.connect("mongodb://localhost/zns", {useNewUrlParser: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10;

    try {
        const passwordHash = await bcrypt.hash(password, hashCost);
        const userDocument = new UserModel({ username, passwordHash });
        await userDocument.save();
        
        res.status(200).send({ username });
        
    } catch (error) {
        res.status(400).send({
            error: 'req body should take the form { username, password }',
        });
    }
});

router.post('/login', (req, res) => {
    passport.authenticate(
        'local',
        { session: false },
        (error, user) => {
            if (!user) {
                res.status(400).json({ error });
            }

            /** This is what ends up in our JWT */
            const payload = {
                username: user.username,
                expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
            };
            //FIX EXPIRES, NAN

            /** assigns payload to req.user */
            req.login(payload, {session: false}, (error) => {
                if (error) {
                    res.status(400).send({ error });
                }

                /** generate a signed json web token and return it in the response */
                const token = jwt.sign(JSON.stringify(payload), secret);
                /** assign our jwt to the cookie */
                res.cookie('jwt', token, { httpOnly: true, secure: true });
                res.status(200).send(payload.username);
            });
        },
    )(req, res);
});

router.get(
    "/protected", 
    passport.authenticate("jwt", {session: false}),
    (req, res) => {
        const user = req; // change to req.user?
        res.status(200).send({ user });
    }
);

module.exports = router;