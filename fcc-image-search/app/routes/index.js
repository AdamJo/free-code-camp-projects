'use strict';

var path = process.cwd();
var ImageHandler = require(path + '/app/controllers/imageHandler.server.js');

module.exports = function (app, passport) {
	var imageHandler = new ImageHandler();

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/api/imagesearch/:id')
		.get(imageHandler.postImages);

	app.route('/api/latest/')
		.get(imageHandler.getImages)
};
