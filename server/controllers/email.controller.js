//Config
var Config = require('../config.js')
//Models
var User = require('../models/user.model')
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

router.route('/emails/send')
.post(function(res,req){
  var mailOption = {
    from : 'grundy.protoqodes@gmail.com',
    to : 'aysondennis133@gmail.com',
    subject : 'Angeles Push Notif',
    text : 'test'
  }
  transporter.sendMail(mailOption,function(error,response){
    if(error) return res.status(401).send({message : 'Something Went Wrong', error});
    console.log(response)
  });
})
module.exports = router;