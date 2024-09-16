const isLoggedIn = (req, res, next) => {
  if (req.user) {
    res.redirect('/')
  } else {
    next()
  }
}

const hasLoggedOut = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/')
  }
}

module.exports = {
  hasLoggedOut,
  isLoggedIn
}
