const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')

passport.serializeUser((user, next) => {
  next(null, user.id) // this user with specific id. has logged in before
})

passport.deserializeUser(function (id, next) {
  User.findById(id, function (err, user) {
    next(err, user)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]'
},
(email, password, next) => {
  User.findOne({email: email})
  .then(user => {
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
