//model/comments.js
'use strict';
//import dependency
// call mongoose database manager
var mongoose = require('mongoose')
// call plugin mongoose data increment
var inc = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var MobileTokensSchema = new Schema({
 user_id : [{type: Schema.Types.ObjectId ,ref: 'User'}],
 is_verified : Number,
 date_time : Date,
 username : String,
 password : String,
 generate_token : String,
 created_at : { type: Date, default: Date.now },
 mobile_token_row : Number
},
{ collection : 'comments' });
MobileTokensSchema.plugin(inc.plugin, {
    model: 'MobileToken',
    field: 'mobile_token_row',
    startAt: 0,
    incrementBy: 1
});

module.exports = mongoose.model('MobileToken', MobileTokensSchema);