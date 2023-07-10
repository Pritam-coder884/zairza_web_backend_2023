const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const { User } = require('../models')


passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`
},
  // function(accessToken, refreshToken, profile, cb){
  //   const profileUser = {
  //     username : profile._json.name,
  //     email : profile._json.email,
  //   }
  //   User.findOne({email : profileUser.email}).then((user) => {
  //     if(!user){
  //       const newUser = new User(profileUser)
  //       newUser.save().then((fetchedUser) => {
  //         return cb(null,fetchedUser)
  //       })
  //     }
  //     else{
  //         return cb(null, user);
  //     }
  //   }).catch((err) => {
  //     return cb(err, null)
  //   }) 
  // }

  async (accessToken, refreshToken, profile, cb) => {
    try {
      const profileUser = {
        username: profile._json.name,
        email: profile._json.email,
      }
      const user = await User.findOne({ email: profileUser.email });
      if (!user) {
        const newUser = new User(profileUser);
        const fetchedUser = await newUser.save();
        return cb(null, fetchedUser)
      }
      else {
        return cb(null, user)
      }
    } catch (error) {
      return cb(error, null)
    }
  }


));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/github/callback`
},
  function (accessToken, refreshToken, profile, cb) {
    const profileUser = {
      username: profile._json.name,
      email: profile._json.email,
    }
    User.findOne({ email: profileUser.email }).then((user) => {
      if (!user) {
        const newUser = new User(profileUser)
        newUser.save().then((fetchedUser) => {
          return cb(null, fetchedUser)
        })
      }
      return cb(null, user)
    }).catch((err) => {
      return cb(err, null)
    })
  }
));

