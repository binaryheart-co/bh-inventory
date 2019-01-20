const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');

passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
    }, 
    async (username, password, done) => {
        try {
            const userDocument = await UserModel.findOne({email: username}).exec();
            if (userDocument != null) {
                const isMatch = await userDocument.comparePassword(password);
                if (isMatch) return done(null, userDocument);
            }
            return done("Incorrect username or password");
        } 
        catch (error) {
            return done("There was an error :(");
        }
    }
));

passport.serializeUser((user, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const userDocument = await UserModel.findById(id).exec();
        return done(null, userDocument);
    }
    catch(e) {
        return done(e);
    }
});

module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) return next();
        res.status(401).json({error: "Ah ah ah, you didn't say the magic word!"});
    }
}