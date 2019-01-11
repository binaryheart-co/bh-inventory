const express = require('express');
const passport = require('passport');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");

const secret = require("../config").jwtSecret;
// const UserModel = require('../models/user');

const router = express.Router();

// router.post('/register', async (req, res) => {
//     const { username, password } = req.body;

//     // authentication will take approximately 13 seconds
//     // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
//     const hashCost = 10;

//     try {
//         const passwordHash = await bcrypt.hash(password, hashCost);
//         const userDocument = new UserModel({ username, passwordHash });
//         await userDocument.save();
        
//         res.status(200).send({ username });
        
//     } catch (error) {
//         res.status(400).send({
//             error: 'req body should take the form { username, password }',
//             message: error,
//         });
//     }
// });

router.post('/login', (req, res) => {
    passport.authenticate(
        'local',
        {session: false},
        (error, user) => {
            if (error || !user) {
                res.status(400).json({ 
                    message: "Something went wrong :(",
                    user: user
                });
            }

            // /** assigns user to req.user */
            req.login(user, {session: false}, (err) => {
                if(err) {
                    res.send(err);
                }

                const token = jwt.sign(user, secret);
                return res.json({user, token});
            });
        }
    )(req, res);
});

module.exports = router;