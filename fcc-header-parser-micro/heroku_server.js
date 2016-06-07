'use strict';

var express = require('express');
var app = express();

app.route('/')
		.get(function (req, res) {
			const clientIP = req.headers['x-forwarded-for'] || "NOT BEHIND PROXY";
			const lang = req.headers['accept-language'].split(',')[0] || 'NOT FOUND';
			const soft =  req.headers['user-agent'].match(/\(([^)]+)\)/)[1] || 'NOT FOUND';
			res.send({ip : clientIP, software : soft, language : lang});
		});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
