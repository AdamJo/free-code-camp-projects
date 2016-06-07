'use strict';

var Urls = require('../models/urls.js');

function LinkShortener () {

	this.getUrl = function (req, res) {
		var userUrl = req.url.substring(1, req.url.length);
		Urls
		.findOne({ 'shortUrl' : userUrl })
		.exec(function(err, result) {
			if (err) { throw err; }
			if (result) {
				res.redirect(result.fullUrl);	
			} else {
				res.send({error : 'No short url found for given input'})
			}
		})
		
	}

	this.postUrl = function (req, res) {
		console.log('one');
		var userUrl = req.url.substring(5, req.url.length);
		//a modified version of the one found below
		//http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
		var regex = /^(https?:\/\/)?([\da-z\.-]+)\.(com|net|org|biz|gov)([\/\w \.-]*)*\/?$/

		if (!userUrl.match(regex)) {
			res.json({error : "No short url found for given input, must be in format of http://www.example.com"})
		} else {
	    	Urls
			.findOne({ 'fullUrl': userUrl })
			.exec(function (err, result) {
				if (err) { throw err; }
				if (result) {
					res.json({
					  fullUrl : result.fullUrl, 
					  shortUrl : process.env.APP_URL+result.shortUrl
					})
				} 
				else {
					Urls.count({}, function (err, count){
						if (err) throw err;
							var url = new Urls({fullUrl : userUrl, shortUrl : count+1})
								url.save(function(err, product) {
									if (err) throw err;
										res.json({
										  fullUrl : product.fullUrl, 
										  shortUrl : process.env.APP_URL+product.shortUrl
										});
								})
					})

				}
			});
		}

	};
}

module.exports = LinkShortener;
