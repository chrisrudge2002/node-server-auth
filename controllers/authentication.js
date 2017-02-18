const jwt = require('jwt-simple');

const config = require('../config');
const User = require('../models/user');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = (req, res, next) => {
	// User has already had their email and password auth'd, we just need to give them a token
	res.send({ token: tokenForUser(req.user) });
};

exports.signup = (req, res, next) => {
	const { email, password } = req.body;

	// Validate the inout
	if (!email || !password) {
		return res.status(422).send({ error: 'You must provide email and password'});
	}

	// See if a user with the given email exists
	User.findOne({ email }, (dbErr, existingUser) => {
		if (dbErr) { return next(dbErr); }

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email is in use' });
		}

		// Otherwise, create a new user record
		const user = new User({
			email,
			password
		});

		// ... and save it to the database
		user.save(usrErr => {
			if (usrErr) { return next(usrErr); }

			// Respond to request indicating the user was successfully created
			res.json({ token: tokenForUser(user) });
		});
	});
};
