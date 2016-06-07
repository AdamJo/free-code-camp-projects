'use strict';

var path = process.cwd();
var LinkShortener = require(path + '/app/controllers/LinkShortener.server.js');

module.exports = function (app) {
	
	var linkShortener = new LinkShortener();
	
	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
	app.route('/api/:id*')
		.get(linkShortener.postUrl);
	app.route('/:id*')
		.get(linkShortener.getUrl);
};
