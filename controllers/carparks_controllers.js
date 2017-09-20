const Carpark = require('../models/Carpark')
const User = require('../models/User')

function create (req, res) {
  // use req to create new database
  var newCarpark = new Carpark({
    name: req.body.name,
    address: req.body.address
  })
  // save carpark into Carpark DB
  newCarpark.save(function (err, newCarpark) {
    if (err) throw err
    res.send({
      status: 200, // 200 means ok
      message: 'New carpark added to your favourites!',
      err: 'ERROR'
    })
  })
  // save carpark into User.carparks DB
  User.findOne({
    username: req.user.username
  },
  function (err, foundUser) {
    if (err) console.log(err)

    foundUser.carparks.push(newCarpark.id)
    foundUser.save()
  })
}

module.exports = {
  create
}
