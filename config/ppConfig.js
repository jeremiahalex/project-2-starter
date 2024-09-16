const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser(function (user, done) {
  done(null, user.id)
})

passport.deserializeUser(function (id, next) {
  User.findById(id, function (err, user) {
    next(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, next) {
  console.log(email)
  console.log(password)
  User.findOne({email: email}, function (err, user) {
    console.log(user)
    if (err) return next(err)
    if (!user) return next(null, false)
    user.validPassword(password, (err, isMatch) => {
      if (err) return next(err)
      if (isMatch) return next(null, user)
      return next(null, false)
    })
  })
  .catch(err => next(err))
}))

module.exports = passport
