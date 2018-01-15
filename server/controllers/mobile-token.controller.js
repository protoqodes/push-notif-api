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
var twilio = require('twilio');
var client_sms = new twilio(Config.twilio_id, Config.twilio_token);

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

   

    req.body.fullname = req.body.first_name + ' ' + req.body.last_name
    // req.body.is_active = 1
    //check username 
    User.find({username : req.body.username})
    .exec(function(err,verify_user){
      if(err) return res.status(503).send(err)
        console.log(verify_user)
      if(verify_user.length != 0){
        return res.status(406).send('username has already been used')
      }
      else{
        //save to database
         var user = new User();
         user.first_name = req.body.first_name;
         user.last_name = req.body.last_name;
         user.mobile = req.body.mobile;
         user.email = req.body.email;
         user.fullname = req.body.fullname;
         user.username = req.body.username;
         user.password = req.body.password;
         user.is_active = req.body.is_active;
         user.permission = '0';

         console.log(user);
        user.save(function(err,user){
        //return err
        if(err) return res.status(503).send(err)
        if(user){
          user.save(function(err,save_user){
            if(err) return res.status(503).send(err)
              if(save_user){
                var mobile_token = new MobileToken();
                mobile_token.user_id = save_user._id;
                mobile_token.is_verified = 0;
                mobile_token.date_time = new Date();
                mobile_token.generate_token = req.body.generate_token
                mobile_token.username = save_user.username;
                mobile_token.password = save_user.password;

                mobile_token.save(function(err,token){
                   client_sms.messages.create({
                      body: 'Hi' + save_user.first_name + '.This is the code:' +  token.generate_token,
                      to: save_user.mobile,  // Text this number
                      from: Config.twilio_number // From a valid Twilio number
                      })
                      .then((message) => console.log('sent'))
                      .catch((error) => res.json(error))
                 

                  return res.json({token:token, user:save_user});
                })

                // return res.json(save_user)
              }            
          })
        }
        else{
          return res.status(503).send('something went wrong!')
        }
      })
      }
    })


    //new instance for Users schema
    // req.body.is_verified = 0;
    // req.body.date_time = new Date();
    // var mobile_token = new MobileToken(req.body);
    // console.log(req.body);
   
    
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