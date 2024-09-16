const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('../config/ppConfig')
const Skill = require('../models/skills')

const multer = require('multer')
const upload = multer({ dest: './uploads/' })
const cloudinary = require('cloudinary')

router.get('/', (req, res) => {
  res.render('users/signup')
})

router.post('/', upload.single('image'), (req, res) => {
  cloudinary.uploader.upload(req.file.path, (result) => {
    var formData = req.body
    var newUser = new User({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      profileImg: result.secure_url
    })
    newUser.save()
  .then(
    user => {
      passport.authenticate('local', {
        successRedirect: `/profile/${user.slug}/settings`
      })(req, res)
    },
    err => res.send(err)
  )
  })
})

module.exports = router
