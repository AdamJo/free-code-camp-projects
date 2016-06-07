'use strict';



var Users = require('../models/users.js');
function ClickHandler () {
	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }

				res.json(result.polls);
			});
	};

	this.addClick = function (req, res) {
		console.log(Object.getOwnPropertyNames(Users))
		Users
			//.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push : { "polls.options" : { $each : [//MULTI INPUT VALUES]  } } } )
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { $push : { "polls.options" : { $each : [{ name : "one" , total : 0 }, { name : "two" , total : 0 }, { name : "three" , total : 0 } ]  } } } )
			.exec(function (err, result) {
					if (err) { throw err; }
					var new_req = req;
					res.json(req.body);
				}
			);
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

					res.json(result.nbrClicks);
				}
			);
	};
}

module.exports = ClickHandler;
