
//first we import our dependencies...
// import Express from 'express';
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var config = require('./config.js');
var inc = require('mongoose-auto-increment');
// fullstack:fullstack@ds145193.mlab.com:45193
mongoose.connect(config.sandBoxDb, {
  useMongoClient: true,
  /* other options test*/
});
inc.initialize(mongoose)
// var User  = require('./routes/user.routes');
// console.log('asd')
//and create our instance
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.PORT || 5016;

//now we should configure the API to use bodyParser and look for JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var engines = require('consolidate');

// app.set('views', __dirname + '/utils/email.template/welcome-template.html');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  // console.log(req);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
//Use our router configuration when we call /api

app.use('/api' ,require('./controllers/users.controller'));
app.use('/api' ,require('./controllers/posts.controller'));
app.use('/api' ,require('./controllers/email.controller'));
app.use('/api' ,require('./controllers/comments.controller'));
app.use('/api' ,require('./controllers/mobile-token.controller'));
//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
