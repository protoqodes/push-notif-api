//Config
var Config = require('../config.js')
//Models
var Comment = require('../models/comment.model')
var User = require('../models/user.model')
var Email = require('./email.controller')
//Imports
var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
require ('mongoose-pagination');

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
//list comment
router.route('/comments/list')
  //retrieve all users from the database
  
  .get(function(req, res) {
    //looks at our User Schema
    var skip = 0;
    var limit = 0;
    var options = {page : 1, limit : limit}
    var aggregate = Comment.aggregate();
    aggregate.lookup({
      from : 'users',
      localField : '_id',
      foreignField : 'user_id',
      as : 'user'
    })
    Comment.aggregatePaginate(aggregate,options,function(err, results, page, countItem){
      if(err)
      {
        console.log(err)
      }
      else
      {
        res.json({results,count:page,itemSize:countItem})
      }


    })
  });
//------------------------------------------------------------
//View comment
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
  // add comment
  router.route('/comments/add')
  //declaire what method to use
  .post(function(req,res){
    //new instance for Comment schema
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

module.exports = router;
