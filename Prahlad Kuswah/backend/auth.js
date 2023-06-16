const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')
const {v4 : uuidv4} = require('uuid')
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID :  process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = {
        email : profile._json.email,
        password : uuidv4(),
        accessToken : accessToken,
        refreshToken : refreshToken
    }
      return cb(null,user);
    
    // console.log(profile)
  }
));

module.exports= passport