const mongoose = require('mongoose')
const Schema = mongoose.Schema
// needed for identifying unique username
const uniqueValidator = require('mongoose-unique-validator')
// needed to hash
const bcrypt = require('bcrypt')

const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please type your username'],
    unique: true,
    uniqueCaseInsensitive: true
  },
  password: {
    type: String,
    minlength: [6, 'Password too short']
  },
  email: {
    type: String,
    required: [true, 'Please type your email'],
    match: [emailRegex, 'Email is invalid']
  },
  carparks: [{
    type: Schema.Types.ObjectId,
    ref: 'Carpark'
  }]
})

// hashing of PW
userSchema.pre('save', function (next) {
  var user = this
   // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()
  // hash the password
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err)
    // Override the cleartext password with the hashed one
    user.password = hash
    next()
  })
})
// defining validPassword so that passport can use
userSchema.methods.validPassword = function (givenPassword) {
  return bcrypt.compareSync(givenPassword, this.password)
}

userSchema.plugin(uniqueValidator, { message: 'Username has been taken!' })

const User = mongoose.model('User', userSchema)

module.exports = User
