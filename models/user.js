
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const profileSchema = new Schema({
  nickname: String,
  about: String,
  skills: String,
  projs: String,
  contact: String // change to Num(?) or another obj later
})

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  profile: [profileSchema],
  slug: String,
  profileImg: String,
  gigs: [{}, {}, {}]
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  var user = this
  user.slug = user.name.toLowerCase().split(' ').join('-')
  bcrypt.hash(user.password, 10)
  .then(hash => {
    user.password = hash
    console.log('pre save flow', user)
    next()
  })
})

userSchema.methods.validPassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, callback)
}

const User = mongoose.model('User', userSchema)

module.exports = User
