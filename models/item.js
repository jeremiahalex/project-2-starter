const mongoose = require( 'mongoose' );

const ItemSchema = new mongoose.Schema( {
  _owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    minlength: [ 5, "Please give a name with more than 4 characters" ],
  },
  description: {
    type: String,
    minlength: [ 20,
      "Please give a description of more than 20 characters" ],
    maxlength: [ 2000,
      "Please shorten your description to less than 2000 characters" ]
  },
  imagelink: String,
  imagePublicId: String,
  _trade: { type: mongoose.Schema.Types.ObjectId, ref: "Trade" }, //blank if not in trade
  valuation: { type: Number }, // dollars
  tradedaway: Boolean
} );

module.exports = mongoose.model( 'Item', ItemSchema );