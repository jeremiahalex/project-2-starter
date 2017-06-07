require( 'dotenv' ).config( { silent: true } );
const mongoose = require( 'mongoose' );
if ( process.env.NODE_ENV === "test" ) {
  console.log( "Test mode: using test db, debug and morgan logger" )
  var debug = require( "debug" );
  var logger = require( "morgan" );
}
mongoose.connect( process.env.MONGODB_URI ||
  'mongodb://localhost/barterFly-test' );

mongoose.Promise = global.Promise;

const express = require( "express" );
const app = express();

const session = require( 'express-session' );

const ejsLayouts = require( 'express-ejs-layouts' );

const methodOverride = require( 'method-override' );

const bodyParser = require( "body-parser" );

const flash = require( 'connect-flash' );

const passport = require( './config/passportConfig' );

//custom middleware blocks route or path down route stack if not logged in
const isLoggedIn = require( './middleware/isLoggedIn' );

const Interface = require( './controllers/interface' );

const Changetracker = require( './models/changetracker' );

// make changetracker if does not exist
Changetracker.find( {}, ( err, response ) => {
  if ( !response[ 0 ] ) Changetracker.create( {
    identifier: "tracker"
  } )
} )

app.set( "view engine", "ejs" );

app.use( session( {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
} ) );

// MUST BE BELOW app.use(session)
app.use( passport.initialize() );
app.use( passport.session() );

//MUST BE BELOW app.use(session)
app.use( flash() );

app.use( function( req, res, next ) {
  // before every route, attach the flash messages and current user to res.locals
  // for viewing in partial
  res.locals.alerts = req.flash(); // for alerts
  res.locals.currentUser = req.user; // for providing views with user info
  next();
} );

app.use( function( req, res, next ) {
  // makes req.safeUserData, which is req.user with no password
  if ( req.user ) {
    let userData = Object.create( req.user );
    userData.password = "hidden";
    req.safeUserData = userData;
  }
  next();
} );

if ( process.env.NODE_ENV === "test" ) {
  app.use( logger( "dev" ) );
}

// add public access to public folder
app.use( '/public', express.static( __dirname + '/public' ) );

//put in form tag: action="/resource?_method=DELETE" (for a delete)
app.use( methodOverride( '_method' ) )

app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );

app.get( "/", ( req, res ) => {
  res.render( "user/landing" );
} );

app.use( ejsLayouts );

//search and browse items
app.use( "/itemSearch", require( './controllers/search' ) );

// authorization router
app.use( '/auth', require( './controllers/auth' ) );

// block routes below this line unless logged in
app.use( isLoggedIn );

// route to WWW user interface
app.use( "/interface", Interface );

// route to user details
app.get( "/profile", function( req, res ) {
  res.render( "user/userProfile", { user: req.user } );
} );

// spin up server to port
if ( process.env.NODE_ENV === "test" ) {
  app.listen( 3000 );
} else
  app.listen( process.env.PORT )

module.exports = app;