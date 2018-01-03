//Config
var Config = require('../config.js')
//Models
var MobileToken = require('../models/mobile-token.model')
var Email = require('./email.controller')
//Imports 
var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');

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
  // add user
  router.route('/verify_token/add_user')
  //declaire what method to use
  .post(function(req,res){
    //new instance for Users schema

    console.log(req.body);
    
  })

//------------------------------------------------------------
//View User
router.route('/verify_token/activated_user/:id')
  .post(function(req,res){
    console.log(req.body);
    User.findOne({_id : req.body.user_id})
      .exec(function(err,user){
        if(user){
          User.update({_id : user._id},{is_active : 1},function(err,user_update){
            // return err
            console.log(user_update)
            if(err) return res.status(503).send(err)
            if(user_update){
              return res.json(user_update)
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