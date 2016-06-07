'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Urls = new Schema({
	fullUrl: String,
	shortUrl: String
});

module.exports = mongoose.model('Urls', Urls);
