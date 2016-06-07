'use strict';

var Users = require('../models/users.js');
var Bars = require('../models/bars.js')
var Yelp = require('yelp');
var mongo = require('mongodb');



function NightHandler () {

	var yelp = new Yelp({
		consumer_key : process.env.YELP_KEY,
		consumer_secret : process.env.YELP_SECRET,
		token : process.env.YELP_TOKEN,
		token_secret : process.env.YELP_TOKEN_SECRET
	});
	this.getEstablishments = function (req, res) {
		if (req.user) {
		Users
			.findOne({ 'github.id': req.user.github.id })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
		} else {
			res.end();
		}
	};

	this.addEstablishments = function (req, res) {
		console.log('addEstablishments');
		var user_data = {};
		var all_bars = [];
		var id_bars = [];
		if (req.body.location) {
			console.log("searching through Yelp");
			yelp.search({ category_filter: 'bars', location: req.body.location, sort : 1, limit : 5 })
			.then(function (data) {
				console.log('inside search');
				user_data = data;
				data.businesses.forEach(function (value) {
					all_bars.push({_id : value.id, name : value.name, total : 0});
					id_bars.push(value.id);
				});
	            mongo.connect(process.env.MONGO_URI, function(err, db){
		            if (err) {throw err}
		            console.log('inside mongo');
		            var bars = db.collection('bars');
					
					bars.insert(all_bars,
					{ordered : false}
					);
					bars.find({_id : { $in : id_bars } }).toArray(function (err, docs) {
						if (err) {console.log(err)}
						user_data.businesses.forEach(function (value, index) {
							docs.every(function(v) {
								if (value.id === v._id) {
									if (user_data.businesses[index].image_url) {
										user_data.businesses[index].image_url = value.image_url.replace("http://", "https://");	
									}
									user_data.businesses[index]['total'] = v.total;
									return false;
								} else {
									return true;
								}
							})
							
						})
  						res.json(user_data);
                    	db.close();
					});
	        	});
			})
			.catch(function (err) {
	  			console.error(err);
	  			res.json(err);
			});

		} else if (req.body.id) {
			console.log('adding to RSVP');
            mongo.connect(process.env.MONGO_URI, function(err, db){
	            if (err) {throw err}
	            var bars = db.collection('bars');
				var users = db.collection('users');

				users.update(
					{'github.id' : req.user.github.id}, 
					{ $addToSet : { 'github.establishments' : req.body.id }}, 
					function (err, docs) {
						if (err) {
							console.log(err);
							throw err;
						} else if (docs.result.nModified) {
							bars.findAndModify(
									{ _id : req.body.id },
									[['total' , 'asc']],
									{ $inc: { total: 1 } },
									{new : true}
								, function (err, results) {
									if (err) {
										console.log(err);
										throw err
									}
						  			res.json(results);
						        	db.close();
				})
						} else {
				  			res.json(docs);
				        	db.close();
							console.log(false);
						}
					});

            });
		} else {
			console.log('failed at yelp search');
			res.end();
		}
	};

	this.removeRSVP = function (req, res) {
		console.log('removeRSVP');
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) {throw err}
            var bars = db.collection('bars');
			var users = db.collection('users');

			users.update(
				{'github.id' : req.user.github.id}, 
				{ $pull : { 'github.establishments' : req.body.id }},
				function (err, docs) {
					if (err) {
						console.log(err);
						throw err;
					} else if (docs.result.nModified) {
						console.log('inside findAndModify')
						bars.findAndModify(
								{ _id : req.body.id },
								[['total' , 'asc']],
								{ $inc: { total: -1 } },
								{new : true}
							, function (err, results) {
								if (err) {
									console.log(err);
									throw err
								}
					  			res.json(results);
					        	db.close();
							}
						)
					} else {
			  			res.json(docs);
			        	db.close();
					}
				});

        });
	};

}

module.exports = NightHandler;
