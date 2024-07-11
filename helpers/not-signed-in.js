module.exports = function(req, res, next) {
	if (!req.user) {
		req.flash('error', 'You must be signed in');
		console.log('Not signed in');
		res.redirect('/#signin');
	} else {
		console.log('Signed in…')
		console.log(req.user);
		next();
	}
}