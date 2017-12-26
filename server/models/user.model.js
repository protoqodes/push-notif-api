//model/comments.js
'use strict';
//import dependency
// call mongoose database manager
var mongoose = require('mongoose'),
 bcrypt = require('bcrypt'),
SALT_WORK_FACTOR = 10;
// call plugin mongoose data increment
var inc = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var UsersSchema = new Schema({
 first_name: String,
 last_name: String,
 full_name : String,
 mobile : String,
 email : String,
 permission : String,
 status : String,
 password : String,
 username : String,
 is_active: Number,
 created_at : { type: Date, default: Date.now },
 user_row : Number
},
{ collection : 'users' });
UsersSchema.plugin(inc.plugin, {
    model: 'User',
    field: 'user_row',
    startAt: 0,
    incrementBy: 1
});
// UsersSchema.pre('save', function(next) {
//     var user = this;
// // only hash the password if it has been modified (or is new)
// if (!user.isModified('password')) return next();
// // generate a salt
// bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);
//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) return next(err);
//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//     });
// });
// });

// UsersSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         console.log(candidatePassword);
//         console.log(this.password);
//         cb(null, isMatch);
//     });
// };
module.exports = mongoose.model('User', UsersSchema);