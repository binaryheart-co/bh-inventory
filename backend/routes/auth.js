const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");

const secret = require("../config").jwtSecret;
const UserModel = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const userDocument = new UserModel({
            username: username, 
            passwordHash: password
        });
        await userDocument.save();
        res.status(200).send({username});
    } 
    catch (error) {
        res.status(400).send({error: error.message});
    }
});

router.post('/login', (req, res) => {
    passport.authenticate(
        'local',
        {session: false},
        (error, user) => {
            if (error || !user) {
                return res.status(400).json({ 
                    message: "Something went wrong :(",
                    user: user,
                    error: error,
                });
            }

            // /** assigns user to req.user */
            req.login(user, {session: false}, (err) => {
                if(err) {
                    return res.send(err);
                }
                
                const token = jwt.sign({user}, secret);
                return res.json({user, token});
            });
        }
    )(req, res);
});

module.exports = router;