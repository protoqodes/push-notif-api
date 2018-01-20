//Config
var Config = require('../config.js')
//Models
var Feedback = require('../models/feedback.model')

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


router.route('/feedback/add')
  .post(function(req,res){
  if(req.body.is_verify == '0'){
    console.log(req.body.email);
    var mailOption = {
      from : 'grundy.protoqodes@gmail.com',
      to : req.body.email,
      subject : 'verify your account',
      text : 'please verify your account by clicking this link http://localhost:8100/verify/' + req.body.user_id
    }
    transporter.sendMail(mailOption,function(error,response){
      if(error) return res.status(401).send({message : 'Something Went Wrong', error});
      //return res.json(response)
    });

    }
 var feedback = new Feedback(req.body);
  return res.json(feedback.save());
})
module.exports = router;