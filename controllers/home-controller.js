// `/` Route
exports.index = (req, res) => {
	res.render('home');
}

exports.home = (req, res) => {
	console.log(req.session.user) 
  	req.send("Hurray! logged in");
	res.render('home');
}