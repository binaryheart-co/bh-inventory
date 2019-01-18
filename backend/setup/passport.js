const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const passportJWT = require('passport-jwt');
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;

const bcrypt = require('bcrypt');
// const secret = require("../config").jwtSecret;
const UserModel = require('../models/user');


passport.use(new LocalStrategy({
        usernameField: "username",
        passwordField: "password",
    }, 
    async (username, password, done) => {
        try {
            const userDocument = await UserModel.findOne({username: username}).exec();
            const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
            if (passwordsMatch) {
                return done(null, username);
            } else {
                return done("Incorrect Username / Password");
            }
        } catch (error) {
            return done(error);
        }
    }
));

// passport.use(new JWTStrategy({
// 		jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
// 		secretOrKey: secret,
// 	},
// 	(jwtPayload, done) => {
// 		// if (jwtPayload.expires > Date.now()) {
// 		// 	return done('jwt expired');
// 		// }
// 		return done(null, jwtPayload.user);
// 	}
// ));