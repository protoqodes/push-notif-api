//Config
var Config = require('../config.js')
//Models
var User = require('../models/user.model')
//Imports 
var express = require('express');
var app = express();
var router = express.Router();

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

    if(err) return res.status(503).send(err)
    if(user){
      if(user.password != req.body.password){
        return res.status(401).send('invalid password')
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

module.exports = router;