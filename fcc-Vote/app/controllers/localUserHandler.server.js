'use strict'
var Users = require('../models/users.js');
var mongo = require('mongodb');
function LocalUserHandler () {
    this.getPolls = function (request, response) {
      console.log('getPolls');
      if (request.user && request.headers.referer.indexOf('poll') === -1) {
          Users.findOne({'github.id': request.user.github.id})
          .exec(function(err, result) {
             if (err) {throw err;}
             response.json(result);
          });
      } else {
            var user_check = request.headers.referer.split('/')[request.headers.referer.split('/').length - 2];
            var poll_check = request.headers.referer.split('/')[request.headers.referer.split('/').length - 1];
            mongo.connect(process.env.MONGO_URI, function(err, db){
                var poll_found;
                if (err) {throw err;}
                var collection = db.collection('users');
                collection.findOne({'github.username' : user_check }, function(err, docs) {
                    if (err) throw err;
                    if (docs) {
                        docs.polls.forEach(function (value, index) {
                        if (value.title === poll_check) {
                             poll_found = [value, index];
                        }
                    });
                    } else {
                        console.log('user not found');
                    }
                    db.close();
                    response.json(poll_found);
                });
          

            });
      }
    };
    
    this.addPolls = function (request, response) {
        console.log('addPolls');
        if (request.body.selected_poll !== undefined) {
          var user_index = request.body.option_index;
          var user_option = request.body.selected_poll;
          var user_title = request.body.selected_title;
          var user_title_index = request.body.title_index;
          var user_username = request.headers.referer.split('/')[request.headers.referer.split('/').length-2];
          var query = "polls." + user_title_index +".options." + user_index + ".total";
          var action = {};
          action[query] = 1;
            mongo.connect(process.env.MONGO_URI, function(err, db){
                if (err) {throw err}
                
                var collection = db.collection('users');

                collection.findAndModify(
                    {'github.username' : user_username },
                    {},
                    { $inc : action },
                    function (err, docs) {
                        if (err) throw err;
                        console.log(err);
                        response.end();
                        db.close();
                    }
                );
            });
          } else {
            var user_poll = request.body.values;
		    var title = user_poll[0];
		    var options = user_poll.slice(1);
    		Users.findOne({
                'polls.title' : title
            }, function (err, poll) {
    		    if (err) {throw err;}
    		    if (poll) {
    		        response.send(title);
    		    } else {
        		Users
    		        .findOneAndUpdate(
        		        {'github.id': request.user.github.id },  
        		        { $push : {"polls" : { 'title' : title,
        		                               'options' : options 
                        } } }
        		      )
    		        .exec(function(err, result) {
        		       if (err) {throw err;}
        		       response.end();
    		    });
    		    }
    		});
        }
    };
    
    this.deletePolls = function (request, response) {
        console.log('deletePolls');
        Users.update({
            'github.id': request.user.github.id 
        },{
            $pull : { 'polls' : { 'title' : request.body.title } }
        } )
        .exec(function(err, result) {
            if (err) {throw err;}
            response.json(result);
        });
    };
}
module.exports = LocalUserHandler;