'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Bars = new Schema([{
            _id : String, 
            name : String,
            count : Number
}]);

module.exports = mongoose.model('Bars', Bars);
