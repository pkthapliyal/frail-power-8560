const passport = require("passport")
var GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.use(new GoogleStrategy({
    clientID: '674308305530-38i4dioh3b72dqfukb4jpudf8uj7bs96.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:8080/auth/google/callback"
},
    function (googleAccessToken, refreshToken, profile, cb) {
        // return cb(null, profile);
        return cb(null, { googleAccessToken, name: profile.displayName, email: profile.emails[0].value })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
})
passport.deserializeUser(function (user, done) {
    done(null, user);
    // console.log(user._json)
})



