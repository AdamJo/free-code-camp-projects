var myApp = angular.module('myApp', ['googlechart']);
//Directive that returns an element which adds buttons on click which show an alert on click
function add_options() {
	$(".options").append("<input class='new_poll' required ng-modle='polls' type='text' placeholder='New Option'>");
}

function reset_new_poll() {
	$('#list_options').html('');
	$(".options").append("<input class='new_poll' required ng-modle='polls' type='text' placeholder='Pics'>");
	$(".options").append("<input class='new_poll' required ng-modle='polls' type='text' placeholder='Videos'>");
}

myApp.controller('grab_poll', ['$http', '$scope', 'poll_data', function($http, $scope, poll_data) {
	
	$scope.tab = true;
	/*
	$scope.tab_switch = function () {
		$scope.tab = false;
	};
	*/
	
	$scope.value_selected = false;
	$scope.content = poll_data.getPoll();
	$scope.index_position = [];
	$scope.content.then(function(payload) {
		$scope.title = (payload.data[0]) ? payload.data[0].title : 'Poll Not Found' ;
		$scope.options = (payload.data[0]) ? payload.data[0].options : '' ;
		$scope.title_index = payload.data[1];
		
		for ( var element in $scope.options) {
			$scope.index_position.push($scope.options[element].name);
		}
	});

	$scope.selectedButton = function (option_name) {
		$scope.value_selected = true;
		$scope.selected_button = option_name;
	};
	
    $scope.submit = function() {
		$scope.index = $scope.index_position.indexOf($scope.selected_button);
		$scope.post_user_option = poll_data.postResults($scope.selected_button, $scope.title, $scope.index, $scope.title_index);
		$scope.post_user_option.then(function(payload) {

		});
    };
  
	$scope.chart = function(data) {
		$scope.content = poll_data.getPoll();
		$scope.content.then(function(payload) {
			$scope.title = payload.data[0].title;
			$scope.options = payload.data[0].options;
		});
		var rows = [];
		for (var x = 0; x < $scope.options.length; x++) {
			if ($scope.options[x].name === $scope.selected_button) {
				rows.push({c : [{v : ($scope.options[x].name)}, {v : ($scope.options[x].total+1)}] });
			} else {
				rows.push({c : [{v : ($scope.options[x].name)}, {v : ($scope.options[x].total)}] });
			}
		}
		$scope.singlePoll = {};
		$scope.singlePoll.type = "ColumnChart";
	    $scope.singlePoll.data = {
	    	"cols": [
	        	{id: "o", label: "options", type: "string"},
	        	{id: "c", label: "count", type: "number"}
	    ], "rows" : rows};
	    $scope.singlePoll.options = {
		"title": $scope.title,
	    "isStacked": "true",
	    "fill": 40,
	    "displayExactValues": true,
	    "hAxis": {
	      "title": "options",
	    },
	    	"vAxis": {
	      		"title": "count",
	            "gridlines": {
	    		  "count": 2
	      		}
	    	}
  		};
		$scope.tab = false;
	};
}]);

myApp.controller('all_polls', ['$http', '$scope', 'poll_data', '$location', function($http, $scope, poll_data, $location) {
	$scope.content = poll_data.getAllPolls();
	$scope.content.then(function(payload) {
		$scope.polls = payload.data.polls;
		$scope.username = (payload.data.github === undefined) ? '' : payload.data.github.username;
	});
	
	$scope.chart = function(data) {
		$scope.show_polls = false;
		var rows = [];
		for (var x = 0; x < data.options.length; x++) {
			rows.push({c : [{v : (data.options[x].name)}, {v : (data.options[x].total)}] });
		}
		$scope.singlePoll = {};
		$scope.singlePoll.type = "ColumnChart";
	    $scope.singlePoll.data = {
	    	"cols": [
	        	{id: "o", label: "options", type: "string"},
	        	{id: "c", label: "count", type: "number"}
	    ], "rows" : rows};
	    $scope.singlePoll.options = {
		"title": data.title + ' : Vote on poll @ ' + location.origin+'/poll/'+$('#userName').text()+'/'+data.title,
	    "isStacked": "true",
	    "fill": 40,
	    "displayExactValues": true,
	    "hAxis": {
	      "title": "options",
	    },
	    	"vAxis": {
	      		"title": "count",
	            "gridlines": {
	    		  "count": 2
	      		}
	    	}
  		};
	};
	$scope.populate = function () {
		$scope.show_polls = true;
		$scope.content = poll_data.getAllPolls();
		$scope.content.then(function(payload) {
			$scope.polls = payload.data.polls;
			$scope.username = payload.data.github.username;
		});
	};
	
	$scope.delete = function (data) {
		delete_poll(data);
		$scope.populate();
	};
	
	$scope.redo = function(data) {
		$scope.delete(data.title);
		var node = document.getElementById('list_options');
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		
		$('#poll_name').val(data.title);
		data.options.forEach(function (currentValue) {
			$(".options").append("<input class='new_poll' required ng-modle='polls' type='text' value="+ currentValue.name +">");
		})

		var controller = angular.element(document.getElementById("MainWrap")).controller();
		controller.tab = 4;
	}
}]);
myApp.factory('poll_data', function ($http) {
	return {
		getAllPolls: function () {
			return $http.get(location.origin+"/api/:id/local");
		}, getPoll : function() {
			return $http.get(location.origin+"/api/:id/local");
		}, postResults : function(name, title, index, title_i) {
			return $http.post(location.origin+"/api/:id/local/", {selected_poll : name, selected_title : title, option_index : index, title_index : title_i});
		}
	};
});

function post_poll() {
	var values = [];
	var extra_options = [];
	var early_stop = false;
	values.push($('#poll_name').val());
	$('.new_poll').each(function(e) {
		if (extra_options.indexOf($(this).val()) > -1) {
			alert('Option name [ ' + $(this).val() + ' ] already exists in current document please replace.');
			$(this).addClass('highlight');
			var current_val = $(this)
			setTimeout(function() {
				current_val.removeClass('highlight');
			}, 1000);
			extra_options = [];
			early_stop = true;
			return false;
		} else {
			extra_options.push($(this).val());
			values.push({ name : $(this).val(), total : 0 });
		}
	});
	
	if (early_stop) {
		return false;
	} else {
	$.ajax({
		type : 'POST',
		data : { values },
		url : location.href+"api/:id/local",
		success : function (data) {
    		if (data) {
    			alert('poll with name [ ' + data + ' ] already exists');
    			$('#poll_name').val('');
    		} else {
    			var poll_link = location.origin + 'poll/' + $('#userName').text() + '/' + $('#poll_name').val();
    			var controller = angular.element(document.getElementById("MainWrap")).controller();
    			controller.tab = 8;
    			$("#new_poll_title").text($('#poll_name').val());
    			$("#new_poll_link").text(poll_link);
    			controller.tab = 8;
    		}
		},
		error : function (data) {
			console.log(data);
		}
  });
	}
}

function delete_poll(title) {
	$.ajax({
		type : 'DELETE',
		data : { title },
		url : location.origin+"/api/:id/local",
		success : function (data) {
			//console.log(data);
		},
		error : function (data) {
			console.log(data);
		}
	});
}

myApp.directive("polls", function(){
	return {
		restrict: "E",
		templateUrl : 'voting_app/directive_html/new_polls.html'
	};
});

myApp.directive("mypolls", function(){
	return {
		restrict: "E",
		templateUrl : 'voting_app/directive_html/my_polls.html'
	};
});

myApp.directive("polllink", function(){
	return {
		restrict: "E",
		templateUrl : 'voting_app/directive_html/successful_poll.html'
	};
});

myApp.controller("OptionsController", function($scope) {
	this.tab = 1;
	this.isSet = function(checkTab) {
		return this.tab === checkTab;
	};

	this.setTab = function(setTab) {
		this.tab = setTab;
	};
});