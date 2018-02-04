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
  .post(function(req, res) {

    console.log(req.body);
    var page = parseInt(req.body.page);
    var skip = 0;
    var limit =  parseInt(req.body.pageSize);
    var query = {};
    var options = { page : page, limit : limit, sortBy: {'created_at': -1}}
    var aggregate = Post.aggregate();
    
    // console.log(req.body);
    query['is_deleted'] = 0;
    if(req.body.title != '' && req.body.title != undefined){
      query['title'] =  {$regex :  new RegExp(''+req.body.title+'', "i")  };
    }
    if(req.body.description != '' && req.body.description != undefined){
      query['description'] = { $regex :  new RegExp(''+req.body.description+'', "i") };
    }
    if(req.body.date_filter && req.body.date_filter != 'Invalid Date'){
       var date_change_start = new Date(req.body.date_filter)
       var date_change_end = new Date(req.body.date_filter)
          date_change_start.setDate(date_change_start.getDate())
          date_change_start.setUTCHours(0,0,0,0)
          date_change_end.setDate(date_change_end.getDate() + 1)
          date_change_end.setUTCHours(0,0,0,0)
           console.log(date_change_start) 
          console.log(date_change_end) 
          query['created_at'] =  {$gte: new Date(date_change_start), $lt: new Date(date_change_end)};
         
    }

    console.log(query);
    aggregate
      .match(query)    
      .lookup({
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
          return res.json({results,count:page,itemSize:countItem})
        }
      })




  });
//------------------------------------------------------------
//Add Post  
router.route('/posts/add')
  .post(function(req, res) {
    //looks at our Post Schema
   req.body.is_deleted = 0;
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
        if(user.is_notify){
          client.messages.create({
                      body: 'title: ' + post.title + ' description: ' +  post.description,
                      to: user.mobile,  // Text this number
                      from: Config.twilio_number // From a valid Twilio number
                      })
                      .then((message) => console.log('sent'))
                      .catch((error) => res.json(error))
        }
      })
    })
    
    return res.json(post)
  });
});
//------------------------------------------------------------
//View Post
router.route('/posts/view/:id')
  .get(function(req,res){
  //   Post.findOne({_id : req.params.id}).populate('comment_id')
  //     .exec(function(err,post){
  //       res.json(post);
  //     })
  // })
   var options = {};
   var aggregate = Post.aggregate();

    aggregate
      .match({ _id: mongoose.Types.ObjectId(req.params.id)})    
      .lookup({
        from: 'comments',
        localField: '_id',
        foreignField: 'post_id',
        as: 'comment_docs'
      })
      .lookup({
        from: 'comments',
        localField: '_id',
        foreignField: 'user_id',
        as: 'user_docs'
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
          return res.json({results})
        }
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
// router.route('/posts/delete/:id')
//   .post(function(req, res) {
//     //find and upd
//     Post.remove({_id : req.params.id},function(err,post){
//       // return err
//       if(err) return res.status(503).send(err)
//       if(post){
//         return res.json(post)
//       }
//       else{
//         return res.status(503).send('something went wrong!')
//       }
//     })
// });

  //Delete User
router.route('/posts/delete/:id')
  .post(function(req,res){
    Post.findOne({_id : req.params.id})
      .exec(function(err,post){
        
        if(post){
             Post.update({_id : post._id},{is_deleted : 1},function(err,post_update){
            // return err
            console.log(post_update)
            if(err) return res.status(503).send(err)
            if(post_update){
              return res.json(post_update)
            }
            else{
              return res.status(503).send('something went wrong!')
            }
          })
        }
        // res.json(user);
      })
  })
//------------------------------------------------------------

module.exports = router;