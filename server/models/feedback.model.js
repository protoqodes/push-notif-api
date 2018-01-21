//model/comments.js
'use strict';
//import dependency
// call mongoose database manager
var mongoose = require('mongoose')
// call plugin mongoose data increment
var inc = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var mongooseAggregatePaginate = require('mongoose-aggregate-paginate');

var FeedbacksSchema = new Schema({
 title : String,
 description : String,
 is_replied: Number,
 user_id : [{type: Schema.Types.ObjectId ,ref: 'User'}],
},
{ collection : 'feedbacks' });
FeedbacksSchema.plugin(inc.plugin, {
    model: 'Feedback',
    field: 'feedback_row',
    startAt: 0,
    incrementBy: 1
});

FeedbacksSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model('Feedback', FeedbacksSchema);