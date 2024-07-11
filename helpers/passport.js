const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');
const config = require('../config/config.js');

// `serializeUser(…)` determines, which data of the user object should be stored in the session.
// Result of the serializeUser method is attached to the session as `req.session.passport.user = {…}`
passport.serializeUser(function(user, done) {
	console.log('Serializing User:');
	let id = user._id;
	console.log('`id`:');
	console.log(id);
	done(null, id);
});

// First argument of `deserializeUser(…)` corresponds to the key of the user object that was given to the done function of `serializeUser(…).` The whole object is retrieved with help of the key.
// The key here is the `user._id` (key can be any key of the user object i.e. name, email etc). In `deserializeUser(…)` that key is matched with the in-memory array or database etc.
// Fetched object is attached to the request object as `req.user`
passport.deserializeUser(function(id ,done) {
	console.log('`id` from `serialize(…)`:');
	console.log(id)
	User.findById(id, function(err, user) {
		console.log('Deserializing user:');
		console.log(user);
		console.log('Error deserializing user (?):');
		console.log(err);
		done(err, user);
	});
});

passport.use(new LocalStrategy({
		// Enter the name attribute of the respective field as in the sign in form
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true,
	},
	function(req, email, password, done) {
		console.log(email);
		console.log(password);
		User.findOne({ "local.email": { $eq : email } }, function (err, user) {
			console.log('User found in collection:');
			console.log(user);
			console.log('Error finding user in collection (?):');
			console.log(err);
			if (err) { return done(err); }
			if (!user) {
				console.log('Incorrect email');
				return done(null, false, { error: 'Incorrect email.' });
			}
			if (!user.validPassword(password)) {
				console.log('Incorrect password');
				return done(null, false, { error: 'Incorrect password.' });
			}

			return done(null, user);
		});
	}
));

passport.use(new TwitterStrategy({
		consumerKey: config.twitter.consumerKey,
		consumerSecret: config.twitter.consumerSecret,
		callbackURL: config.twitter.callbackURL
	},
	function(token, tokenSecret, profile, cb) {
		console.log('In Twitter strategy');
		User.findOne( { "twitter.id" : { $eq : profile.id } }, function (err, user) {
			if (err) return cb(err);
			if (user) {
				console.log('Twitter user found…');
				return cb(null, user);
			} else {
				console.log('Twitter user not found…');
				User.create({
					auth: "twitter",
					twitter: {
						token: token,
						id: profile.id,
						username: profile.username,
						displayname: profile.displayName
					},
					local: {}
				}, (err, createdUser) => {
					console.log('Error creating add Twitter authentication…')
					if (err) {
						throw err;
					} else {
						return cb(null, createdUser);
					}
				});
			}
		});
	}
));

module.exports = passport;
