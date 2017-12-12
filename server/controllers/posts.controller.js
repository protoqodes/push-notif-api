//Config
var Config = require('../config.js')
//Models
var Post = require('../models/post.model')
//Imports 
var express = require('express');
var FCM = require('fcm-push');
var fcm = new FCM('AAAAkQQFZPY:APA91bEXo2Ar1jq6V4yWK_dRR48mSDJZJ_HyJaCZGvPhefSI48fxOxyd3KGjKoYsDJD3R8ifPt92X0y4GJorKhnYdnOYRcp6p2h40yuFJflh9kUC2sIme-o075wIRv1ARJ-y_6MjHDr8');
var app = express();
var router = express.Router();
router.route('/posts/test')
  .get(function(req,res){
      res.json(fcm);
  })

//------------------------------------------------------------
//now  we can set the route path & initialize the API
//list Post
router.route('/posts/list')
  .get(function(req, res) {
    //looks at our Post Schema
    Post.find()
    .sort({created_at : -1})
    .exec(function(err,posts){
      if(err) return res.status(512).send({message : 'an error accured'})
       return res.json(posts)
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