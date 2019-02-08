const express = require('express');
const passport = require('passport');
const UserModel = require('../models/user');

const {body, validationResult} = require('express-validator/check');
const commonList = require("../utilities/passwordCheck/passwordCheck");

const router = express.Router();

router.post('/register', 
    [
        body("email").isEmail().withMessage("Please enter a valid email address.")
            .custom(async v => {
                return UserModel.findOne({email: v}).then(user => {
                    if(user) return Promise.reject("E-mail already in use.");
                });
            }),
        body("password").isLength({min: 8, max: 64})
            .withMessage("The password must be between 8 and 64 characters long.")
            .custom(v => {
                if(commonList.test(String(v))) throw new Error("We need a more secure password. Try something memorable but unique.");
                return true;
            }),
        body("firstName").isString(),
        body("lastName").isString(),
    ], 
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        const { email, password, firstName, lastName } = req.body;

        try {
            const userDocument = new UserModel({ email, password, firstName, lastName });
            await userDocument.save();
            return res.status(200).send({email});
        }
        catch (error) {
            // if(error.name === "ValidationError") {
            //     let errors = {};
            //     for(path in error.errors) {
            //         errors[path] = error.errors[path].message;
            //     }
            //     return res.status(400).json(errors);
            // }
            // else if (error.name === "MongoError" && (error.code === 11000 || error.code === 11001)) {
            //     return res.status(400).json({email: "That email is already used"});
            // }
            // return res.status(500).json({error: "There was a server error :("});
            return next(500);
        }
    }
);

router.post('/login', (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if(err === 500) return res.status(500).json({error: "There was a server error :("});
        if(err === 400 || !user) return res.status(400).json({error: "Incorrect username or password"});
        req.logIn(user, (err) => {
            if(err) return res.status(500).json({error: "There was a server error :("});
            return res.json({email: req.user.email});
        });
    })(req, res, next);
});

router.post("/logout", (req, res) => {
    req.logout();
    res.json({message: "Logged out."});
})

module.exports = router;