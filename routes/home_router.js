const express = require('express')
const router = express.Router()
const Quote = require('../models/quote')
const User = require('../models/user')

const moment = require('moment')

// Show quote on homepage. Depends on either morning, afternoon, evening
router.get('/', (req, res) => {
  var startOfToday = moment().startOf('day')
  var currentHour = moment().hour()
  var timeEvent

  if (currentHour >= 3 && currentHour <= 12) timeEvent = 1
  if (currentHour >= 12 && currentHour <= 18) timeEvent = 2
  if (currentHour >= 18 && currentHour <= 24) timeEvent = 3

  Quote.findOne({
    timeEvent,
    publishedAt: {
      $gte: startOfToday
    }
  })
  .then(quote => {
    res.render('home', { quote })
  })
  .catch(err => console.log(err))
})

// add quote into profile collection
router.post('/addcollection', (req, res) => {
  var prevPage = req.header('referer')
  var user = req.user
  if (!user) return res.redirect('/login')

  var quoteId = req.body.quoteId
  var quotesArr = user.addedQuotes
  // check if quotes are alr added by user
  if (quotesArr.indexOf(quoteId) !== -1) {
    if (prevPage.includes('quotes/collection')) {
      res.redirect('/quotes/collection')
    } else {
      res.redirect('/')
    }
  }
  User.findByIdAndUpdate(user.id, {
    $push: {
      addedQuotes: quoteId
    }
  })
  .then(() => {
    if (prevPage.includes('quotes/collection')) {
      res.redirect('quotes/collection')
    } else {
      res.redirect(`/`)
    }
  })  // http://localhost:7000/quotes/collection)
})

// display quotes in profile
router.get('/profile/:slug', (req, res) => {
  const user = req.user
  if (!user) {
    console.log('user has not logged in')
    return res.redirect('/')
  }
  const addedQuotes = user.addedQuotes
  Quote.find({
    '_id': { $in: addedQuotes }
  })
  .then((addedQuotes) => {
    // console.log('addedQuotes', addedQuotes)
    Quote.find({
      'creatorId': user.id
    })
    .then((personalQuotes) => {
      // console.log('personalQuotes', personalQuotes)
      res.render('users/myCollection', { addedQuotes, personalQuotes, user })
    })
  })
})
// Delete personal Quote
router.delete('/:id', (req, res) => {
  var user = req.user
  Quote.findByIdAndRemove(req.params.id)
  .then(() => res.redirect(`/profile/${user.slug}`))
  .catch(err => console.log(err))
})


module.exports = router
