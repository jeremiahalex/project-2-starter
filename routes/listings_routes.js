const Listings = require('../models/listings')
const Offers = require('../models/offer')
const User = require('../models/user')
const Comments = require('../models/comment')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  Listings
  .find()
  .then(listings => {
    res.render('listings/listings', {
      listings
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.post('/', (req, res) => {
  var newList = new Listings({
    photos: req.body.image,
    description: req.body.description,
    title: req.body.title,
    author: req.user.id,
    dealt: false
  })
  newList.save()
    .then(
      () => res.redirect('/listings'),
      err => res.send(err)
    )
})

router.get('/requests/:id', (req, res) => {
  var id = req.params.id
  Listings
  .findOne({
    _id: id
  })
  .then(listing => {
    Offers.find({ offerId: req.params.id })
    .populate('author')
    .then(offers => {
      Comments.find( {to: req.params.id })
      .populate('by')
      .then(comment => {
        res.render('listings/requests', {
          listing, offers, comment
        })
      })
    })
  })
  .catch(err => {
    console.log(err)
  })
})

router.put('/requests/:id', (req, res) => {
  var formData = req.body
  Listings.findByIdAndUpdate(req.params.id, {
    title: formData.title,
    description: formData.description
  })
  .then(() => res.redirect(`/profile/${req.user.username}`))
  .catch(err => console.log(err))
})

router.delete('/requests/:id', (req, res) => {
  Listings.findByIdAndRemove(req.params.id)
  .then(() => res.redirect('/'))
  .catch(err => console.log(err))
})

router.post('/requests/:id', (req, res) => {
  var newOffer = new Offers({
    description: req.body.description,
    photos: req.body.image,
    title: req.body.title,
    offerId: req.params.id,
    author: req.user.id,
    dealt: false
  })
  newOffer.save()
    .then(offers => {
      Listings.findById(req.params.id)
      .then(listings => {
        listings.offerId = offers.id
        listings.save()
      })
    }
    )
    .then(
      () => res.redirect(`/listings/requests/${req.params.id}`),
      err => res.send(err)
    )
})

router.put('/requests/:id/update', (req, res) => {
  Listings.findByIdAndUpdate(req.params.id, {
    dealt: true
  })
  .then((listings) => {
    Offers.findByIdAndUpdate(listings.offerId, {
      dealt: true
    })
      .then(() => {
        res.redirect(`/listings/requests/${req.params.id}`)
      })
  })
})

router.post('/requests/:id/comment', (req, res) => {
  User.findById(req.user.id)
    .then(users => {
      var newComment = new Comments({
        comment: req.body.comment,
        by: req.user.id,
        to: req.params.id
      })
      newComment.save()
        .then(comments => {
          res.redirect(`/listings/requests/${req.params.id}`)
        })
    })
})

module.exports = router
