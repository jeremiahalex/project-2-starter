const express = require('express');
const router = express.Router();

const passport = require('../helpers/passport');
const isSignedIn = require('../helpers/not-signed-in');

const homeController = require('../controllers/home-controller');
const authController = require('../controllers/auth-controller');
const oracleController = require('../controllers/oracle-controller');
const referenceController = require('../controllers/reference-controller');
const recordsController = require('../controllers/records-controller');

// Home
router.get('/', homeController.index);
router.get('/home', isSignedIn, homeController.index);

// Local Authentication
router.get('/#signin', authController.signin);
router.post('/signin',
	passport.authenticate('local', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash: 'Invalid email or password',
		successFlash: 'You are now signed in'
	})
);
router.get('/signout', authController.signout);

// Local Account Creation
router.get('/#signup', authController.signup);
router.post('/signup', authController.signup);

// Sign Up or Sign In with Twitter
router.get('/twitter',
	passport.authenticate('twitter'));
router.get('/twitter/callback',
	passport.authenticate('twitter', {
		failureRedirect: '/'
	}),
	function(req, res) {
		console.log('req.user:');
		console.log(req.user);
		// res.json(req.user);
		// Successful authentication, redirect home.
		console.log('Here?')
		res.redirect('/home');
		console.log('Or here?')
	}
);

// Yarrow Stalk Oracle
router.get('/consult', isSignedIn, oracleController.consult);

// Submit Result from Yarrow Stalk Oracle
router.post('/result', isSignedIn, recordsController.result);
// router.get('/result', isSignedIn, recordsController.result)

// Records
router.get('/records', isSignedIn, recordsController.records);

// Reference
router.get('/hexagram/original/:query', referenceController.original);
router.get('/hexagram/resultant/:query', referenceController.resultant);
router.get('/result/:query', referenceController.result);
module.exports = router;
