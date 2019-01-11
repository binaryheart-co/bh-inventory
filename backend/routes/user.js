const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
    "/protected", 
    passport.authenticate("jwt", {session: false}),
    (req, res, next) => {
        const user = req.user;
        res.status(200).send({user});
    }
);

module.exports = router;