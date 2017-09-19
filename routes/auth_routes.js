const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth_controllers')
const passport =
require('../config/passport')

router.get('/register', function (req, res) {
  res.render('auth/signup')
})

router.post('/register', authController.register)

router.get('/login', function (req, res) {
  res.render('auth/login')
})

router.post('/login',
 passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/login'
 }))

router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

module.exports = router
