'use strict';

var path = process.cwd();
var NightHandler = require(path + '/app/controllers/nightHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/home');
		}
	}

	var nightHandler = new NightHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/loggedIn.jade');
		});
		
	app.route('/home')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/home');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/home'
		}));

	app.route('/api/:id/nightlifely')
		.get(nightHandler.getEstablishments)
		.post(nightHandler.addEstablishments)
		.delete(isLoggedIn, nightHandler.removeRSVP);
};
