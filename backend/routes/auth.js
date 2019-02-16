const express = require('express');
const passport = require('passport');
const UserModel = require('../models/user');

const { body, validationResult } = require('express-validator/check');
const commonList = require("../utilities/passwordCheck/passwordCheck");

const router = express.Router();

router.post('/register', 
    [
        body("email").isEmail().withMessage("Please enter a valid email address.")
            .custom(async v => {
                return UserModel.findOne({ email: v }).then(user => {
                    if(user) return Promise.reject("E-mail already in use.");
                });
            }),
        body("password").isString().isLength({ min: 8, max: 64 })
            .withMessage("The password must be between 8 and 64 characters long.")
            .custom(v => {
                if(commonList.test(String(v))) throw new Error("We need a more secure password. Try something memorable but unique.");
                return true;
            }),
        body("firstName").isString().isLength({min: 1}),
        body("lastName").isString().isLength({min: 1}),
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
            return next({catch: error});
        }
    }
);

router.post('/login', 
    [
        body("email").isString().isLength({min: 1}),
        body("password").isString().isLength({min: 1}),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) return next({validation: errors.array()});

        passport.authenticate("local", (err, user) => {
            if(err && err.validation) return next({validation: err.validation}); //400 incorrect username/password
            else if(err && err.catch) return next({catch: err.catch}); //500 internal server error
            req.logIn(user, (err) => {
                if(err) return next({catch: err}); //500 internal server error
                return res.json({email: req.user.email});
            });
        })(req, res, next);
    }
);

router.delete("/logout", (req, res) => {
    req.logout();
    res.json({message: "Logged out."});
})

module.exports = router;