'use strict';

var Search = require('../models/search.js');
var request = require('request');

function ImageHandler () {

	this.getImages = function (req, res) {
		Search.find({}, { _id : false, __v : false }).sort({'_id': 'desc'}).limit(10).exec(function(err, result) {
			if (err) throw err;
			res.json(result);
		})
	};

	this.postImages = function (req, res) {

		var url = req.params.id;

		var search = new Search({term : url});
		search.save();
		
		var page = req.url.split('?=');
		
		if (page.length > 1 && typeof parseInt(page[page.length-1]) === 'number') {
			url = page[page.length-1] + '?q=' + url;
		} else {
			url = '?q=' + url;
		}
		
		request.get({
		    url: 'https://api.imgur.com/3/gallery/search/'+url,
    		headers: {
        		'Authorization': 'Client-ID ' + process.env.IMGUR_ID
    		}
		}, function (err, req, body) {
	    		if (err) {
	        		throw err;
	    		}
	    		var organizedJson = [];
	    		var jsonData = JSON.parse(body);
	    		if (typeof jsonData.data[0] === 'undefined') {
	    			organizedJson = {error : 'nothing found with query : ' + url};
	    		} else if ( jsonData.data.length < 10 ) {
		    		for (var item = 0; item < jsonData.data.length; item++){
		    			organizedJson.push(
		    				{ 
		    					url : jsonData.data[item].link, 
		    					title: jsonData.data[item].title, 
		    					description : jsonData.data[item].description
		    					
	    				});
	    			}
	    		} else {
	    			var splicedJson = jsonData.data.slice(0,10);
		    		for (var item = 0; item < splicedJson.length; item++){
		    			organizedJson.push(
		    				{ 
		    					url : splicedJson[item].link, 
		    					title: splicedJson[item].title, 
		    					description : splicedJson[item].description
	    				});
	    			}
	    		}
			res.json(organizedJson)	
			}
		)
	};
}

module.exports = ImageHandler;
