const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  })
})

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, function(email,password,done){
  User.findOne({ email : email }, function(err,user){
    console.log('\nfound a unique user!\n'.blue,user,'\n');
    if (err) return done(err);
    if (!user) return done(null,false);
    if (!user.validPassword(password)) return done(null,false);
    //modifying passport stuff GASP!
    user.loginTime = new Date();
    user.save(function(err,data){
      if (err) console.log(err);
      console.log('after appending login time..'.green,data);
      return done(null,data);
    })
  })
}))

module.exports = passport;
