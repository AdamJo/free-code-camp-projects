'use strict';

var express = require('express');
var app = express();

app.use('/', express.static(process.cwd() + '/core'));
app.use('/*', express.static(process.cwd() + '/core'));

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
