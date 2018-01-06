  //Config
var Config = require('../config.js')
//Models
var User = require('../models/user.model')
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
router.route('/users/list')
  //retrieve all users from the database

  .get(function(req, res) {
    //looks at our User Schema
    User.find()
    .sort({created_at : -1})
    .exec(function(err,users){
      if(err) return res.status(512).send({message : 'an error accured'})
       return res.json(users)
    })
  });
//------------------------------------------------------------
//View User
router.route('/users/view/:id')
  .get(function(req,res){
    User.findOne({_id : req.params.id})
      .exec(function(err,user){
        res.json(user);
      })
  })
//------------------------------------------------------------
  //------------------------------------------------------------
  //call an endpoint to return a callback
  // add user
  router.route('/users/add')
  //declaire what method to use
  .post(function(req,res){
    //new instance for Users schema
    req.body.fullname = req.body.first_name + ' ' + req.body.last_name
    var user = new User(req.body);
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
        user.save(function(err,user){
        //return err
        if(err) return res.status(503).send(err)
        if(user){
          user.save(function(err,save_user){
            if(err) return res.status(503).send(err)
              if(save_user){
                  // app.use('/emails/send', Email)
                // app.runMiddleware('/emails/send',{method:'post'},function(responseCode,body,headers){
                //      // Your code here
                //      console.log(responseCode);
                // })
                console.log(save_user)
                var mailOption = {
                  from : 'grundy.protoqodes@gmail.com',
                  to : save_user.email,
                  subject : 'Angeles Push Notif',
                  html : '<p>Hi '+ save_user.first_name+'<br/> Click the link <a href="http://localhost:4200/activated_user/'+ save_user._id +'">Activate your account here</a></p>'
                }

                console.log(mailOption)
                transporter.sendMail(mailOption,function(error,response){
                  if(error) return res.status(401).send({message : 'Something Went Wrong', error});
                  console.log(response)
                });



                return res.json(save_user)
              }            
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
    console.log('--here--')
    console.log(user)
    console.log('--here--')
    if(err) return res.status(503).send(err)
    if(user){
      if(user.password != req.body.password){
        return res.status(401).send('invalid password')
      }
      if(user.is_active === 0){
        // return res.status(401).send('Need to Confirm it to Email')
          return res.json({message :'Need to Confirm it to Email', user: user })
      }

      else{
        return res.json({user:user})
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
       if(user.is_active === 0){
         // return res.status(401).send('Need to Confirm it to Email')
         return res.json({message :'Need to Confirm it to Email', user : user })
       }
      else{
        if(user.permission === '1'){
          return res.json({user:user})
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
//Activate User
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