'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var app = express();
console.log('+ require()');
require('dotenv').load();
console.log('+ dotenv');
require('./app/config/passport')(passport);
console.log('+ Passport');
var bodyParser = require('body-parser');
console.log('+ body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true } ));
console.log('+ body-parser use');
mongoose.connect(process.env.MONGO_URI);
console.log('+ connected to mongo');
app.use('/voting_app', express.static(process.cwd() + '/voting_app'));
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/angular-chart', express.static(process.cwd() + '/node_modules/angular-chart'));
app.use('/common', express.static(process.cwd() + '/app/common'));
console.log('+ added paths');
app.use(session({
	secret: 'secretClementine',
	resave: false,
	saveUninitialized: true
}));
console.log('+ sessions');
app.use(passport.initialize());
app.use(passport.session());
console.log('+ passports functions');
routes(app, passport);
console.log('+ routes');
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
console.log('+ listen');
