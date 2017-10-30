const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const userSchema = new Schema({
  name: {
   type: String,
   required: [true, 'Name is required']
 },
 email: {
   type: String,
   required: [true, 'Email is required.']
 },
 password: {
   type: String,
   required: [true, 'Password is required.']
 },
  slug: String,
 travelplan: [{
   type: Schema.Types.ObjectId,
   ref: 'Travel'
 }]
 })

// and save the hash instead
userSchema.pre('save', function(next) {
  var user = this
  // logic to create slug
  user.slug = user.name.toLowerCase().split(' ').join('-')

  bcrypt.hash(user.password, 10)
  .then(hash => { // the then method here is when we got the hash
    // call the next() when the password is hashed
    user.password = hash
    console.log('pre save flow', user)
    next() // next() is calling the save()
  })
})

userSchema.methods.validPassword = function (plainPassword, callback) {
  return bcrypt.compare(plainPassword, this.password, callback)
}

const User = mongoose.model('User', userSchema)

// need to export this
module.exports = User
