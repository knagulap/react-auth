const GoogleStrategy = require("passport-google-oauth20").Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const passport = require("passport");

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      // You might want to save user details to the database here
      return callback(null, profile);
    }
  )
);

// Instagram Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "/auth/instagram/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // Logic to handle user authentication and retrieve user details
      // Handle errors if any and pass them to 'done'
      // e.g., if (error) return done(error);
      // Process the profile data and save to the database if needed
      // Finally, call 'done' with the user object or an error
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
