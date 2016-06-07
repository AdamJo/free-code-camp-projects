'use strict';

var path = process.cwd();
var LocalUserHandler = require(path + '/app/controllers/localUserHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		console.log('isLoggedIn');
		if (req.isAuthenticated()) {
			console.log('isLoggedIn IF');
			return next();
		} else {
			console.log('isLoggedIn ELSE');
			res.redirect('/home');
		}
	}

	function grab_poll (req, res, next) {
		var name_and_poll = req.url.split('/');
		var username = name_and_poll[2];
		var user_poll = name_and_poll[3];
		if (username && user_poll && name_and_poll.length < 5) {
			return next();
		} 
		else {
			res.redirect('/');
		}
	}

	var localUserHandler = new LocalUserHandler();

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/voting_app/index.jade', { auth : true, username : req.user.github.username });
		});

	app.route('/home')
		.get(function (req, res) {
			res.render(path + '/voting_app/index.jade', { auth : false });
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/home');
		});
		
	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/aprofile.html');
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
			failureRedirect: '/login'
		}));

	app.route('/poll/*')
		.get(grab_poll, function(req, res, next) {
			var name_and_poll = req.url.split('/');
			var user = name_and_poll[2];
			var user_poll = name_and_poll[3];
			var username = (req.user === undefined) ? ' ' : req.user.github.username;
			res.render(path + '/voting_app/voting_on_poll.jade', { username : username, name : user, poll : user_poll });
		});
		
	app.route('/api/:id/local')
		.get(localUserHandler.getPolls)
		.post(localUserHandler.addPolls)
		.delete(isLoggedIn, localUserHandler.deletePolls);
		
};
