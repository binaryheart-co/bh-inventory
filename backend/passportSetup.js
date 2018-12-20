const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const bcrypt = require('bcrypt');

const secret = "secret"

const UserModel = require('./models/user');

passport.use(new LocalStrategy({
	usernameField: "username",
	passwordField: "password",
}, async (username, password, done) => {
	try {
		const userDocument = await UserModel.findOne({username: username}).exec();
		const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);
        console.log(username);
		if (passwordsMatch) {
			return done(null, userDocument);
		} else {
			return done('Incorrect Username / Password');
		}
	} catch (error) {
		done(error);
	}
}));

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
};

passport.use(new JWTStrategy({
		jwtFromRequest: cookieExtractor,
		secretOrKey: secret,
	},
	(jwtPayload, done) => {
		if (jwtPayload.expires > Date.now()) {
			return done('jwt expired');
		}
		return done(null, jwtPayload);
	}
));