const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Skill = require('../models/skills')
const Gig = require('../models/gigs')

/* Attempted to input user's gigs in user card but not successful */
router.get('/:slug', (req, res) => {
  Gig.find().populate('author')
    .then(gigs => {
      User.findOne({ slug: req.params.slug })
    .then(people => {
      var context = {
        gig: gigs,
        peep: people
      }
      res.render('users/card', context)
    })
    })
})

router.get('/:slug/settings', (req, res) => {
  if (req.user.name !== req.params.slug) {
    res.redirect('/')
  } else {
    Skill.find()
  .then(skills => {
    User.findOne({slug: req.params.slug})
  .then(people => {
    var context = {
      skills: skills,
      peep: people
    }
    res.render('users/profile', context)
  })
  })
  }
})

router.put('/:slug/settings', (req, res) => {
  var profileData = req.body
  console.log(profileData)
  User.findOne({
    slug: req.params.slug
  })
  .then((user) => {
    if (!user.profile.length) {
      user.profile.push({
        nickname: profileData.nickname,
        about: profileData.about,
        skills: profileData.skills,
        projs: profileData.projs,
        contact: profileData.contact
      })
    } else {
      user.profile[0].nickname = profileData.nickname
      user.profile[0].about = profileData.about
      user.profile[0].skills = profileData.skills
      user.profile[0].skills = profileData.skills
      user.profile[0].projs = profileData.projs
      user.profile[0].contact = profileData.contact
    }
    user.save()
    .then(
      user => res.redirect(`/profile/${user.slug}`),
      err => res.send(err)
    )
  })
})

module.exports = router
