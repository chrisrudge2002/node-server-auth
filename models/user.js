const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// On Save Hook, encrypt password
userSchema.pre('save', function(next) {
	const user = this;

	// Generate the password salt, then run the callback function
	bcrypt.genSalt(10, (saltErr, salt) => {
		if (saltErr) { return next(saltErr); }

		// Hash (encrypt) the password using the salt, then run the callback function
		bcrypt.hash(user.password, salt, null, (hashErr, hash) => {
			if (hashErr) { return next(hashErr); }

			// Overwrite plain text password with the encrypted version
			user.password = hash;

			// Allow the save operation to continue
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
		if (err) { return callback(err); }

		callback(null, isMatch);
	});
};

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;
