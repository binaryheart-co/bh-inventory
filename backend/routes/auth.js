const express = require('express');
const passport = require('passport');
const UserModel = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const userDocument = new UserModel({ email, password, firstName, lastName });
        await userDocument.save();
        return res.status(200).send({email});
    }
    catch (error) {
        if(error.name === "ValidationError") {
            let errors = {};
            for(path in error.errors) {
                errors[path] = error.errors[path].message;
            }
            return res.status(400).json(errors);
        }
        else if (error.name === "MongoError" && (error.code === 11000 || error.code === 11001)) {
            return res.status(400).json({email: "That email is already used."});
        }
        return res.status(400).send({error: "There was an error. Please try again."});
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({email: req.user.email});
});

router.post("/logout", (req, res) => {
    req.logout();
    res.json({message: "Logged out."});
})

module.exports = router;