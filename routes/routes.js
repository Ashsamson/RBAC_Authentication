const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/authsmiddleware');
const {authRegister, authLogin} = require('./auths')
const RateLimiter = require('express-rate-limit');


// Set up rate limiting
const limiter = RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });


// route to register new users
router.post("/Register", authRegister);

//route to Authentication and login 
router.post('/Login', limiter, authLogin);

//role based authorization *admin  only
router.get('/admin/login', authenticate, authorize('admin'),(req,res)=>{
    return res.status(200).json({msg: 'Thank you being an admin..only admin can access this api!'})   
});
  
//role based authorization *shippers only 
router.get('/shipper/login', authenticate, authorize('admin', 'shipper'),(req,res)=>{
    return res.status(200).json({msg: 'only admins and shippers can access this api!'})   
});
  
//role based authorization carriers, 
router.get('/carrier/login', authenticate, authorize('admin', 'shipper','carrier'),(req,res)=>{
    return res.status(200).json({msg: ' this is a general zpi for admins, shippers and carries only'})   
});
  
//role based authorization members only 
router.get('/members/login', authenticate, authorize('admin', 'shipper','carrier','members'),(req,res)=>{
    return res.status(200).json({msg: ' Thank you for being a member of our company..! This is a general api for all users!(i.e for all roles)'})   
});


module.exports= router