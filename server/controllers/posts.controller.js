//Config
var Config = require('../config.js')
//Models
var Post = require('../models/post.model')
var Comment = require('../models/comment.model')
var User = require('../models/user.model')
//Imports 
var ObjectId = require('mongoose').Types.ObjectId;
var express = require('express');
var FCM = require('fcm-push');
var fcm = new FCM('AAAAkQQFZPY:APA91bEXo2Ar1jq6V4yWK_dRR48mSDJZJ_HyJaCZGvPhefSI48fxOxyd3KGjKoYsDJD3R8ifPt92X0y4GJorKhnYdnOYRcp6p2h40yuFJflh9kUC2sIme-o075wIRv1ARJ-y_6MjHDr8');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
require ('mongoose-pagination');
var twilio = require('twilio');
var client = new twilio(Config.twilio_id, Config.twilio_token);
router.route('/posts/test')
  .get(function(req,res){
      res.json(fcm);
  })

//------------------------------------------------------------
//now  we can set the route path & initialize the API
//list Post
router.route('/posts/list')
  .get(function(req, res) {
    var skip = 0;
    var limit =  10;
    var options = { page : 1, limit : limit, sortBy: {'created_at': -1}}
    var aggregate = Post.aggregate();
      
     aggregate.lookup({
                  from: 'comments',
                  localField: '_id',
                  foreignField: 'post_id',
                  as: 'comment_docs'
                })
              // .sort({'created_at' : 1})
                
      Post.aggregatePaginate(aggregate, options, function(err, results, page, countItem) {
        if(err)
        {
          console.log(err)
        }
        else
        {
          console.log(results)
          return res.json({results,count:page,itemSize:countItem})
        }
      })




  });
//------------------------------------------------------------
//Add Post  
router.route('/posts/add')
  .post(function(req, res) {
    //looks at our Post Schema
   var post = new Post(req.body);
   var message = {
    to: 'registration_token_or_topics', // required fill with device token or topics
    collapse_key: 'green', 
    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    }
};
   post.save(function(err,post){
    if(err) return res.status(512).send({message : 'an error accured'})
    User.find().exec(function(err,users){
    if(err) return res.status(500).send('something went wrong!')
      users.forEach(user => {
      client.messages.create({
                    body: 'title: ' + post.title + ' description: ' +  post.description,
                    to: user.mobile,  // Text this number
                    from: Config.twilio_number // From a valid Twilio number
                    })
                    .then((message) => console.log('sent'))
                    .catch((error) => res.json(error))
      })
    })
    
    return res.json(post)
  });
});
//------------------------------------------------------------
//View Post
router.route('/posts/view/:id')
  .get(function(req,res){
    Post.findOne({_id : req.params.id})
      .exec(function(err,post){
        res.json(post);
      })
  })
//------------------------------------------------------------
//Edit Post
router.route('/posts/edit/:id')
  .post(function(req, res) {
    //find and upd
    Post.update({_id : req.params.id},req.body,function(err,post){
      // return err
      if(err) return res.status(503).send(err)
      if(post){
        return res.json(post)
      }
      else{
        return res.status(503).send('something went wrong!')
      }
    })
});
router.route('/posts/delete/:id')
  .post(function(req, res) {
    //find and upd
    Post.remove({_id : req.params.id},function(err,post){
      // return err
      if(err) return res.status(503).send(err)
      if(post){
        return res.json(post)
      }
      else{
        return res.status(503).send('something went wrong!')
      }
    })
});
module.exports = router;