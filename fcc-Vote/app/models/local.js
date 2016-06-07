'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var local_user = new Schema({
	account: {
		name: String,
		email: String,
      password: String
	},
   polls: {
       title: String,
       options : []
   }
});

module.exports = mongoose.model('localUser', local_user);
