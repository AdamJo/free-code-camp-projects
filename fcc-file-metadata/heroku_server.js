'use strict';

var express = require('express');
var multer = require('multer');
var app = express();

app.use('/', express.static(process.cwd() + '/public'));

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res){
    upload(req,res,function(err, result) {
        if(err) {
            console.log(err);
            return res.end(err);
        }
        if (req.file) {
            res.end("File size = " + req.file.size + " bytes" );
        } else {
          res.end("no file found");
        }
    });
});

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
