const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../setup/passport");

router.get("/protected", ensureAuthenticated, (req, res) => {
    res.json({email: req.user.email, firstName: req.user.firstName});
});

module.exports = router;