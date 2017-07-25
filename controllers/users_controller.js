const User = require('../models/User')

function register (req, res) {
  User.create(req.body, function (err, newUser) {
    if (err) {
      req.flash('errors', err.message)
      return res.redirect('/users/register')
    }
    req.flash('message', 'New Account Created, Please Login.')
    res.redirect('/users/login')
  })
}

module.exports = {
  register
}
