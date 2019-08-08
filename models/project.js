const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema ({
  title : String,
  created : { type: Date, default: Date.now },
  creator : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  pattern :{
    type : Schema.Types.ObjectId,
    ref : 'Pattern'
  },
  category : String,
  //estimatedTimeCreator : String,
  material : String,
  reflection : String,
  imageUrl : String
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
