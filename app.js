// Dependencies
const path = require('path'); // working with file and directory paths
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// const methodOverride = require('method-override');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const expressValidator = require('express-validator');
// const server = require('http').createServer(app); // Sockets runs on server, not express
// const io = require('socket.io')(server);
const flash = require('connect-flash');
const passport = require('passport');
const port = process.env.PORT || 3000;

const routes = require('./routes/routes');
const config = require('./config/config.js');

// Middlewares
mongoose.Promise = global.Promise;
mongoose.connect(
	config.mongodb.uri,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true
	}
).then(
	() => { console.log('>>> Mongoose   Ready <<<'); },
	(err) => { console.log(err) }
);

app.use(cookieParser()); // Read cookies for auth
app.use(bodyParser.json()); // Get information from HTML forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', expressHandlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Create session
app.use(session({
	name: 'oracle-of-changes',
	secret: config.session.secret,
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		url : config.mongodb.uri,
		ttl: 14 * 24 * 60 * 60,
		autoRemove: 'native' }),
	cookie: {
		// secure: true,
		maxAge: 14 * 24 * 60 * 60 * 1000 // 14 days in milliseconds
	}
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
// Get Passport tp piggy back off the Express's session to store data for authenticated users
app.use(passport.session());

// Use connect-flash for flash messages stored in session
app.use(flash());

app.use((req, res, next) => {
	// Before every route, attach the flash messages and current user to res.locals
	res.locals.alerts =  req.flash();
	res.locals.currentuser =  req.user;
	next();
});

// Validator for Express
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		let namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while (namespace.length) {
			formParam += '['+ namespace.shift()+ ']'
		}

		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}));


// Routes
app.use('/', routes);

app.listen(port, () => {
	console.log('>>> Server Connected <<<');
});
