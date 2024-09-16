const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gigSchema = new Schema({
  name: String,
  dates: String,
  specs: String,
  wage: String,
  description: String,
  skills: String,
  slug: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

gigSchema.pre('save', function (next) {
  var gig = this
  gig.slug = gig.name.toLowerCase().split(' ').join('-')
  next()
})

const Gig = mongoose.model('Gig', gigSchema)

module.exports = Gig
