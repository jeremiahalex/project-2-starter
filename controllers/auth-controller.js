const passport = require('../helpers/passport');
const User = require('../models/user');

// `/signin` Route
exports.signin = (req, res) => {
	console.log(req.body);
	res.render('home');
}

// `/signout` Route
exports.signout = (req, res) => {
	req.logout()
	req.flash('success', 'You have signed out')
	res.redirect('/');
}

// `/signup` Route
exports.signup = (req, res) => {
	console.log(req.body);
	req.checkBody('firstname', 'Please enter your first name').notEmpty();
	req.checkBody('lastname', 'Please enter your last name').notEmpty();
	req.checkBody('email', 'Please enter an email address').notEmpty();
	req.checkBody('password', 'Please enter a password').notEmpty();
	req.checkBody('confirm_password', 'Please confirm your password').notEmpty();
	if (req.body.confirm_password) {
		req.checkBody('password', 'You did not enter the same password').equals(req.body.confirm_password);
	}

	let errors = req.validationErrors();
	if (errors) {
		console.log('Error encountered…');
		console.log(errors);
		res.render('home', {'errors': errors});
	} else {
		console.log('creating account…');
		User.create({
			auth: 'local',
			local: {
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password
			},
			twitter: {}
		}, (err, createdUser) => {
			if (err) {
				console.log('Error creating account…')
				console.log(err)
				req.flash('error', 'Unable to create user account')
				res.render('home');
			} else {
				console.log(createdUser);
				passport.authenticate('local', {
					successRedirect: '/home',
					successFlash: 'Account created and signed in'
				})(req, res);
			}
		});
	}
}
