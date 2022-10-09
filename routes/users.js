const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')
const sessions = require('express-session')


const sessionConfig = {
    secret:'thisshouldbeasecret!',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60*24*7,
        maxAge: 1000 * 60 *60*24*7
    }
}
router.use(sessions(sessionConfig))

router.get('/register',async(req,res)=>{
   res.render('users/register')
})

router.post('/register', catchAsync(async(req,res)=>{
    try {
      const {email,username,password} = req.body;
      const user =  new User({email,username})
      const registeredUser = await User.register(user,password)
      req.login(registeredUser,err=>{
         if(err) return next(err)
         req.flash('success','Welcome to ABC Bank')
         res.redirect('/customers')
      })
      
    } catch (e) {
      req.flash('error',e.message)
      res.redirect('/register')
    }
 }))

 router.get('/login',(req,res)=>{
    
    res.render('users/login')
 })

 router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','welcome back!')
    const redirectUrl = req.session.returnTo || '/customers'
    delete req.session.returnTo
    res.redirect(redirectUrl)
 })

 router.get('/logout',(req,res)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','goodbye!!')
      res.redirect('/customers')
    });
 })

module.exports = router;