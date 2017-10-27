const User = require('../models/user')
const Tweet = require('../models/tweet')
const express = require('express')
const router = express.Router()


router.get('/', (req, res) => {
  var user = req.user
  // not logged in (no tweets)
  if (!user) res.render('home')
  // logged in (show user tweets)
  else {
    User.findById(user.id)
    .populate('tweets')
    .then(currentUser => res.render('home', { currentUser }))
  }
})

router.put('/new-tweet', (req, res) => {
  // variables
  var userId = req.body.userId
  var tweet = req.body

  // creating new entry in tweet collection
  var newTweet = new Tweet()
  newTweet.message = tweet.message
  newTweet.author = userId
  newTweet.save()

  // adding tweet to user
  User.findById(userId)
  .then(currentUser => {
    currentUser.tweets.push(newTweet.id)
    currentUser.save()
  })
  .then(() => res.send({message: 'Tweet added!'}))
  .catch(() => console.log('no user found'))
})

module.exports = router