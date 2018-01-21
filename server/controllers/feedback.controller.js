//Config
var Config = require('../config.js')
//Models
var Feedback = require('../models/feedback.model')
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


router.route('/feedback/add')
  .post(function(req,res){

  req.body.is_replied = 0
  if(req.body.is_verify == '0'){
    console.log(req.body.email);
    var mailOption = {
      from : 'grundy.protoqodes@gmail.com',
      to : req.body.email,
      subject : 'verify your account',
      // text : 'please verify your account by clicking this link http://localhost:4200/verify/' + req.body.user_id
      html : '<p><br/>Please verify your account by clicking this link  Click the link <a href="http://localhost:4200/verify/'+ req.body.user_id +'">Activate your account here</a></p>'
    }
    transporter.sendMail(mailOption,function(error,response){
      if(error) return res.status(401).send({message : 'Something Went Wrong', error});
      //return res.json(response)
    });

    }
 var feedback = new Feedback(req.body);
  return res.json(feedback.save());
})

router.route('/feedback/list')
 .post(function(req,res){

  Feedback.find()
    .populate('user_id')

    .sort({created_at : -1})
    .exec(function(err,feedback){
      if(err) return res.status(512).send({message : 'an error accured'})
       return res.json(feedback)
    })

})

router.route('/feedback/reply')
 .post(function(req,res){

       var mailOption = {
        from : 'grundy.protoqodes@gmail.com',
        to : req.body.email,
        subject : 'Replied to comment',
        text : req.body.description
      }

       transporter.sendMail(mailOption,function(error,response){
        if(error) return res.status(401).send({message : 'Something Went Wrong', error});
           Feedback.update({_id : req.body.feedback_id},{is_replied:1},function(err,feedback){
               return res.json(response)

          })
      });



})

 router.route('/feedback/verify/:user_id')
 .post(function(req,res){

     User.findOne({_id : req.body.user_id})
      .exec(function(err,user){
        if(user){
          User.update({_id : user._id},{is_verify : 1},function(err,user_update){
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


module.exports = router;
