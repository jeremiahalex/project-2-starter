const mongoose = require('mongoose')
const Schema = mongoose.Schema

var placeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  address: String,
  place_id: String,
  trips: [{
    type: Schema.Types.ObjectId,
    ref: 'Trip'
  }]
})

const Place = mongoose.model('Place', placeSchema)

module.exports = Place
