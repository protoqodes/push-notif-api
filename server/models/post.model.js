//model/comments.js
'use strict';
//import dependency
// call mongoose database manager
var mongoose = require('mongoose')
// call plugin mongoose data increment
var inc = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var PostsSchema = new Schema({
 title : String,
 description : String,
 img : String,
 created_at : { type: Date, default: Date.now },
 user_row : Number
},
{ collection : 'posts' });
PostsSchema.plugin(inc.plugin, {
    model: 'Post',
    field: 'post_row',
    startAt: 0,
    incrementBy: 1
});

module.exports = mongoose.model('Post', PostsSchema);