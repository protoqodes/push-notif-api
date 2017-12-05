//Config
var Config = require('../config.js')
//Models
var Post = require('../models/post.model')
//Imports 
var express = require('express');
var app = express();
var router = express.Router();

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
   post.save(function(err,post){
    if(err) return res.status(512).send({message : 'an error accured'})
    return res.json(post)
  });
});
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