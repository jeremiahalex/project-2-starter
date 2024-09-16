const express = require('express')
const router = express.Router()
const Gig = require('../models/gigs')
const Skill = require('../models/skills')

router.get('/new-gig', (req, res) => {
  res.render('../views/gigs/new-gig')
})

router.post('/new-gig', (req, res) => {
  var formData = req.body
  var newGig = new Gig({
    name: formData.name,
    dates: formData.deadline,
    specs: formData.specs,
    wage: formData.wage,
    description: formData.description,
    skills: formData.skills,
    author: formData.userID
  })
  newGig.save()
  .then(
    (gig) => res.redirect(`/gigs/${gig.slug}`),
    err => res.send(err)
  )
})

router.get('/:slug', (req, res) => {
  Gig.findOne({
    slug: req.params.slug
  }).populate('author')
  .then((gig) => {
    // res.send(req.user.name)
    res.render('../views/gigs/gig-card', {
      gig
    })
  })
})

router.post('/:slug', (req, res) => {
  Gig.findOne({
    slug: req.params.slug
  })
  .then((gig) => {
    res.redirect(`/gigs/${gig.slug}/edit`)
  })
})

router.get('/:slug/edit', (req, res) => {
  Skill.find()
  .then(skills => {
    Gig.findOne({slug: req.params.slug}).populate('author')
  .then((gig) => {
    if (req.user.name !== gig.author.name) {
      res.redirect('/')
    } else {
      Gig.findOne({slug: req.params.slug})

  .then((gig) => {
    var context = {
      gig: gig,
      skills: skills
    }
    res.render('../views/gigs/edit', context)
  })
    }
  })
  })
})

router.put('/:slug/edit', (req, res) => {
  var newGigData = req.body
  Gig.findOne({
    slug: req.params.slug
  })
  .then((gig) => {
    gig.name = newGigData.name
    gig.dates = newGigData.dates
    gig.specs = newGigData.specs
    gig.wage = newGigData.skills
    gig.description = newGigData.description
    gig.skills = newGigData.skills
    gig.save()
  .then(
    (gig) => res.redirect(`/gigs/${gig.slug}`),
    err => res.send(err)
  )
  })
})

router.delete('/:slug/edit', (req, res) => {
  var gigId = req.body.gigID
  console.log(gigId)

  Gig.findByIdAndRemove(gigId)
  .then(() => {
    console.log('success!!')
    res.redirect('/')
    // res.send({message: 'user deleted'})
  })
  .catch(err => console.log(err))
})

module.exports = router
