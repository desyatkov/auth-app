const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Localstrategy = require('passport-local');

//create local strategy
const localOptions = {
  usernameField: 'email'
};

const localLogin = new Localstrategy(localOptions, function(email, password, done){
  // Verify this username password
  User.findOne({email: email}, function (err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // is 'password' === user.password?
    user.comparePassword(password, function(err, isMatch){
      if(err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});


//setup jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//create strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // see if the user ID in the payload exist in database
  // if it does call 'done'
  // otherwise, cale done without a user object
  User.findById(payload.sub, function(err, user){
    if(err) { return done(err, false) }

    if(user){
      done(null, user)
    } else {
      done(null, false)
    }
  })

});

// tell passport to use this strata
passport.use(jwtLogin);
passport.use(localLogin);