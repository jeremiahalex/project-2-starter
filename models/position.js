const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DateOnly = require('mongoose-dateonly')(mongoose)


const positionSchema = new Schema({
  name: String,
  ticker:  String,
  buyDate: DateOnly,
  sellDate: DateOnly,
  units: Number,
  price: Number,
  assetClass: String,
  closingPrice: Number,
  user: [{
  type: Schema.Types.ObjectId,
  ref: 'User'
}]
})

positionSchema.virtual('amountInvested').get(function () {
  return this.price * this.units
})

positionSchema.virtual('currentMarketValue').get(function () {
  if (!this.closingPrice) return this.price * this.units
  return this.closingPrice * this.units
})

positionSchema.pre('save', function(next) {
  var position = this

  if (!position.closingPrice)
  position.closingPrice = position.price
    next()
  })


const Position = mongoose.model('Position', positionSchema)

module.exports = Position
