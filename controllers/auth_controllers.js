const User = require('../models/User')

function register (req, res) {
  var newUser = new User ({
    name: req.body.user.name,
    email: req.body.user.email,
    password: req.body.user.password
  })

  newUser.save(function (err, createrUser) {
    if (err) {
      return res.send(err)
    }
    res.redirect('/profile')
  })
}

function login (req, res) {

  User
  .findOne({
    email: req.body.user.email
  })
  .exec(function (err, foundUser) {
    if (err) return res.send(err)

    const formPassword = req.body.user.password

    if(foundUser.validPassword(formPassword)) {
      res.send('valid, redirect to profile')
    } else {
      res.send('invalid, show flash message')
    }
  })
}

module.exports = {
  register,
  login
}
