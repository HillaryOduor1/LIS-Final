const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  // Tenant users strategy
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  // Master admin strategy – use separate callback URL
  passport.use('google-master', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.MASTER_GOOGLE_CALLBACK_URL, // ✅ critical
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));
};
/*const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.use('google', new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  }, async (req, accessToken, refreshToken, profile, done) => {
    // Profile is passed to controller
    return done(null, profile);
  }));
};*/