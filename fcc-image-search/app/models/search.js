'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Search = new Schema({
    //previousSearches : [{
    term: String,
    when: {
        type: Date,
        default: Date.now() //may need to add .now() to make it work
    }
});

module.exports = mongoose.model('Search', Search);
