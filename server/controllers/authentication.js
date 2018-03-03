const jwt  = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({
    sub: user.id,
    iat: timestamp
  }, config.secret, null, null)
}

exports.signin = function(req, res, next){
  // User has already email and pass
  // we just need to give a token
  res.send({token: tokenForUser(req.user) });
};

exports.signup = function(req, res, next){
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({error: 'You must provide email and password'});
  }
  // See if a user with the given email exist
  User.findOne({email: email}, function(err, existingUser){
    if(err){
      return next(err)
    }
    // If email does exist return error
    if(existingUser){
      return res.status(422).send({error: 'Email is in use'});
    }

    // If email does NOT exist add record return res
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err){
      if(err){ return next(err)}

      res.json({ token: tokenForUser(user) })
    })
    // User was created
  });
};