require('dotenv').config({silent: true})

// ======= Setup of Dependencies & Middlewares ======= //
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const dbUrl = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://localhost/MakeGood'
const port = process.env.PORT || 3000
const passport = require('./config/ppConfig')

const { hasLoggedOut, isLoggedIn } = require('./helpers')

// ======= Setup of Routes ======= //
const signupRoutes = require('./routes/signup_routes')
const gigsRoutes = require('./routes/gigs_routes')
const loginRoutes = require('./routes/login_routes')
const profileRoutes = require('./routes/profile_routes')

const User = require('./models/user')
const Gig = require('./models/gigs')
const Skill = require('./models/skills')

const app = express()

mongoose.Promise = global.Promise
mongoose.connect(dbUrl, {
  useMongoClient: true
})
.then(
  () => { console.log('db is connected') },
  (err) => { console.log(err) }
)

// ======= Use Middlewares ====== //
app.use(express.static(path.join(__dirname, 'public')))
app.use(function (req, res, next) {
  console.log('Method: ' + req.method + ' Path: ' + req.url)
  next()
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  app.locals.user = req.user
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(methodOverride('_method'))

// ======= Setup of main GET reqs ======= //
/* Using handlebars template engine */
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', (req, res) => {
  Gig.find()
  .populate('author')
.then(gig => {
  res.render('gigs-search', {
    gig
  })
})
.catch(err => {
  console.log(err)
})
})

app.post('/', isLoggedIn, (req, res) => {
  const keyword = req.body.keyword
  const regex = new RegExp(keyword, 'i')

  Gig.find({
    name: regex
  })
  .limit(9)
  .then(gig => res.send(gig))
  .catch(err => res.send(err))
})

app.delete('/deleteUser', (req, res) => {
  var userId = req.body.userId
  console.log(userId)

  User.findByIdAndRemove(userId)
  .then(() => {
    console.log('success!!')
    res.redirect('/')
  })
  .catch(err => console.log(err))
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/peeps', (req, res) => {
  User.find()
  // .limit(10)
.then(peep => {
  res.render('peeps-search', {
    peep
  })
})
.catch(err => {
  console.log(err)
})
})

app.post('/peeps', (req, res) => {
  const keyword = req.body.keyword
  const regex = new RegExp(keyword, 'i')

  User.find({
    name: regex
  })
  .limit(9)
  .then(user => res.send(user))
  .catch(err => res.send(err)) // in case we have an error
})

app.get('/logout', hasLoggedOut, (req, res) => {
  req.logout()
  res.redirect('/')
})

// ===== handlebars ===== //
var hbs = require('handlebars')
hbs.registerHelper('equal', function (lvalue, rvalue, options) {
  if (arguments.length < 3) {
    throw new Error('Handlebars Helper equal needs 2 parameters')
  }
  if (lvalue != rvalue) {
    return options.inverse(this)
  } else {
    return options.fn(this)
  }
})

// ======= Use Routes ======= //
app.use('/signup', isLoggedIn, signupRoutes)
app.use('/gigs', gigsRoutes)
app.use('/login', isLoggedIn, loginRoutes)
app.use('/profile', profileRoutes)

// ======= END: Local port Listen ======= //
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
