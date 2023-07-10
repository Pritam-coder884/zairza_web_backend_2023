const express = require('express')
const passport =require('passport')
const route = express.Router();
const {AuthController} = require('../controllers')
const {authentication} = require('../middlewares')

route.get('/auth/login/failed', AuthController.loginFailed)

//use this route to fetch user details after passport authentication
route.get('/auth/login/success', authentication.authenticationGoogleandGithub, AuthController.loginSuccess)

route.get('/auth/logout', AuthController.logout)


//google
route.get('/auth/google', passport.authenticate("google",{scope : ["profile", "email"]})) //route to be called while logging in
route.get('/auth/google/callback', passport.authenticate("google", {
    successRedirect : process.env.CLIENT_URL,
    failureRedirect : '/auth/login/failed' 
}))

//github
route.get('/auth/github', passport.authenticate('github',{scope : ["profile"]}));
route.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect : process.env.CLIENT_URL,
    failureRedirect : '/auth/login/failed',
}));



module.exports = route