const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 13;

const userSchema = new Schema({
	auth: {
		type: String,
		required: true
	},
	local: {
		firstname: {
			type: String
		},
		lastname: {
			type: String
		},
		email: {
			type: String,
			unique: true,
			sparse: true
		},
		password: {
			type: String
		}
	},
	twitter: {
		id: {
			type: String,
			unique: true,
			sparse: true
		},
		token: {
			type: String,
			unique: true,
			sparse: true
		},
		username: {
			type: String,
			unique: true,
			sparse: true
		},
		displayname: {
			type: String
		}
	}
});

userSchema.pre('save', function(next) {
	let user = this.local;
	console.log("userSchema.pre('save\…)");
	console.log(user.password);
	console.log('New account (?):')
	console.log(user.isModified('local.password'));

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('local.password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // Override the plain text password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.validPassword = function(password) {
	let user = this.local;
	console.log('Plain text password: ');
	console.log(password)
	console.log('Hashed password: ');
	console.log(user.password)
	return bcrypt.compareSync(password, user.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;