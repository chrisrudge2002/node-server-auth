const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local');
const passport = require('passport');

const config = require('../config');
const User = require('../models/user');

// Setup options for local strategy
const localOptions = {
	usernameField: 'email'
};

// Create local strategy
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// Verify this user name and password are correct
	User.findOne({ email }, (usrErr, user) => {
		if (usrErr) { return done(usrErr, false); }

		// Call done with the user object if the credentials are valid
		if (user) {
			// Check password is correct
			user.comparePassword(password, (err, isMatch) => {
				if (err) { return done(err); }
				if (!isMatch) { return done(null, false); }

				return done(null, user);
			});
		} else {
			// ... otherwise call done with false
			done(null, false);
		}
	});


});

// Setup options for JWT strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// See if the user ID in the payload exists in our database
	User.findById(payload.sub, (usrErr, user) => {
		if (usrErr) { return done(usrErr, false); }

		// If it does, call 'done' with that user
		if (user) {
			done(null, user);
		} else {
			// ... otherwise, call done without a user object
			done(null, false);
		}
	});
});

// Tell passport to use these strategies
passport.use(jwtLogin);
passport.use(localLogin);
