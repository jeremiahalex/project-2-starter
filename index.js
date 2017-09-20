require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

const url = process.env.MLAB_URI || 'mongodb://localhost:27017/project-2'

mongoose.Promise = global.Promise
mongoose.connect(url, {
  useMongoClient: true
}).then(
  function () { // resolve cb
    console.log('connected successfully')
  },
  function (err) { // reject cb
    console.log(err)
  }
)

const app = express()

app.use(express.static('public'))

app.use(session({
  store: new MongoStore({
    url: process.env.MLAB_URI || 'mongodb://localhost:27017/project-2'
  }),
  secret: 'foo',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())

// initialize passport
const passport = require('./config/passport')
app.use(passport.initialize())
// the line below must be AFTER the session setup
app.use(passport.session())

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: 'views/partials'
}))
app.set('view engine', 'handlebars')
app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash())

const usersRoute = require('./routes/userRoute')
const carparksRoute = require('./routes/carparkRoute')

app.get('/', function (req, res) {
  res.render('home', {
    user: req.user
  })
})

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// non public paths
app.use('/users', usersRoute)
app.use('/carparks', carparksRoute)

app.locals = {
  GOOGLE_KEY: process.env.GOOGLE_KEY
}

const port = process.env.PORT || 4000
app.listen(port, function () {
  console.log(`express is running on ${port}`)
})
