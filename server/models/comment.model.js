//model/comments.js
'use strict';
//import dependency
// call mongoose database manager
var mongoose = require('mongoose')
// call plugin mongoose data increment
var inc = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var CommentsSchema = new Schema({
 user_id : [{type: Schema.Types.ObjectId ,ref: 'User'}],
 post_id : [{type: Schema.Types.ObjectId ,ref: 'Post'}],
 is_deleted : Number,
 date_time : Date,
 description : String,
 created_at : { type: Date, default: Date.now },
 comment_row : Number
},
{ collection : 'comments' });
CommentsSchema.plugin(inc.plugin, {
    model: 'Comment',
    field: 'comment_row',
    startAt: 0,
    incrementBy: 1
});

module.exports = mongoose.model('Comment', CommentsSchema);