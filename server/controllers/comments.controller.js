//Config
var Config = require('../config.js')
//Models
var Comment = require('../models/comment.model')
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
//now  we can set the route path & initialize the API
//list user
router.route('/comments/list')
  //retrieve all users from the database

  .get(function(req, res) {
    //looks at our User Schema
    Comment.find()
    .populate('comment')
    .sort({created_at : -1})
    .exec(function(err,comments){
      if(err) return res.status(512).send({message : 'an error accured'})
       return res.json(comments)
    })
  });
//------------------------------------------------------------
//View User
router.route('/comments/view/:id')
  .get(function(req,res){
    Comment.findOne({_id : req.params.id})
      .exec(function(err,user){
        res.json(user);
      })
  })
//------------------------------------------------------------
  //------------------------------------------------------------
  //call an endpoint to return a callback
  // add user
  router.route('/comments/add')
  //declaire what method to use
  .post(function(req,res){
    //new instance for Users schema
    // req.body.fullname = req.body.first_name + ' ' + req.body.last_name
    req.body.date_time = new Date()
    req.body.is_deleted = 0
    var comment = new Comment(req.body);
    //check username 

    // console.log(comment);

    comment.save(function(err,comment){
      if(err) return res.status(503).send(err)
      //   console.log(err);
        // console.log(comment);
        res.json(comment)
    })

   
  })
//------------------------------------------------------------
//edit user
router.route('/users/edit/:id')
.post(function(req,res){
  //find and update user
  User.update({_id : req.params.id},req.body,function(err,user){
    // return err
    if(err) return res.status(503).send(err)
    if(user){
      return res.json(user)
    }
    else{
      return res.status(503).send('something went wrong!')
    }
  })
})
//------------------------------------------------------------
//login user
router.route('/users/login')
.post(function(req,res){
  User.findOne({username :req.body.username})
  .exec(function(err,user){

    if(err) return res.status(503).send(err)
    if(user){
      if(user.password != req.body.password){
        return res.status(401).send('invalid password')
      }
      if(user.is_active === 0){
        return res.status(401).send('Need to Confirm it to Email')
      }

      else{
        return res.json(user)
      }
    }
    else{
      return res.status(401).send('invalid username')
    }
  })
})
//------------------------------------------------------------
//login user admin
router.route('/users/login/admin')
.post(function(req,res){
  console.log(req.body);
  User.findOne({username :req.body.username})
  .exec(function(err,user){
    
    if(err) return res.status(503).send(err)
    if(user){
      if(user.password != req.body.password){
        return res.status(401).send('invalid password')
      }
      else{
        if(req.body.permission === '1'){
          return res.json(user)
        }
        else{
          return res.status(401).send('you are not allowed to access this site')
        }
      }
    }
    else{
      return res.status(401).send('invalid username')
    }
  })
})

//------------------------------------------------------------
//View User
router.route('/users/activated_user/:id')
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