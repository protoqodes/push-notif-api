//Config
var Config = require('../config.js')
//Models
var MobileToken = require('../models/mobile-token.model')
var User = require('../models/user.model')
var Email = require('./email.controller')
//Imports 
var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
var ObjectId = require('mongoose').Types.ObjectId; 

// Mail Config
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: Config.node_mailer_type,
    user: Config.node_mailer_user,
    clientId: Config.node_mailer_client_id,
    clientSecret: Config.node_mailer_client_secret,
    refreshToken: Config.node_mailer_refresh_token
    // accessToken: 'ya29.GluuBAYPJAEgAY_wz2LvYcpXNN3N_Ieag0zTVfzpvXlaXh5QWxEyN41uJ8hY_cKo3rGitXTdqYXa7ZKtQMRfZC_ZuFvdWefvuKKAT7Iuw3G5G-ZPwUmTb_p-diKI',
  },
  });


  //------------------------------------------------------------
  //call an endpoint to return a callback
 
  router.route('/verify_token/add_user')
  //declaire what method to use
  .post(function(req,res){
    //new instance for Users schema
    req.body.is_verified = 0;
    req.body.date_time = new Date();
    var mobile_token = new MobileToken(req.body);
    console.log(req.body);
    mobile_token.save(function(err,token){
      res.json(token);
    })
    
  })


router.route('/verify_token/activated_user/:id')
  .post(function(req,res){
    // console.log(req.body);
    MobileToken.findOne({user_id :  new ObjectId(req.body.user_id),generate_token: req.body.generate_token})
      .exec(function(err,mobile_token){
        if(!mobile_token){
          return res.json(err);
        }  
        if(mobile_token){
          User.update({_id : new ObjectId(mobile_token.user_id[0])},{is_active : 1},function(err,user_update){
            if(err) return res.json(err)
            if(user_update){
               MobileToken.update({_id :  new ObjectId(mobile_token._id),generate_token: mobile_token.generate_token},{is_verified : 1},function(err,update_token){
                   console.log(update_token)
                   if(err) return res.json(err)
                   return res.json(update_token)
               })

             
            }
            else{
              return res.status(503).send('something went wrong!')
            }
          })
        }
         
      })
  })
//------------------------------------------------------------

module.exports = router;