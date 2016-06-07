var myApp = angular.module('myApp', ['ngCookies']);

myApp.controller('MainCtrl', ['$scope', '$http', 'bar_data', '$cookies', function($scope, $http, bar_data, $cookies) {
    angular.element(document).ready(function () {
        if ($cookies.get('last_search')) {
            $scope.search_location($cookies.get('last_search'));
        }
    });
    
    
	$('#user_form').submit(function(){
        $(this).find('input[type=submit]').prop('disabled', true);
    });
    
    $scope.search_location = function(data) {
        if (data) {
            $scope.current_user_search = data;
        } else {
            $scope.current_user_search = $('#user_location').val();    
        }
        $scope.content = bar_data.grabAll($scope.current_user_search);
    		$scope.content.success(function(payload) {
                $scope.businesses = payload.businesses;
                $scope.getRSVP();
                if ($scope.businesses === undefined) {
                    document.getElementById("user_form").reset();
                    document.getElementById("error_message").innerText = "Address did not work";
                    $('#user_location').addClass('highlight');
        			setTimeout(function() {
				        $('#user_location').removeClass('highlight');
				        document.getElementById("error_message").innerText = "Bar meet up bar place for bar meet people";
			        }, 2000);
                }
                $('input[type=submit]').prop('disabled', false);
    		});
    };
    $scope.login = function() {
        $cookies.put('last_search', $scope.current_user_search);
        $scope.cookie = $cookies.get('last_search');
        window.location.replace(window.location.origin+'/auth/github?unique');
    };
    $scope.rsvp = function(id, index) {
        $scope.disabled = true;
        $scope.content = bar_data.postRSVP(id);
        $scope.content.then(function(payload) {
            if (payload.data.value) {
                $('#'+id).addClass('hidden');
                $('#'+id+'_remove').removeClass('hidden');
                $scope.businesses[index].total = payload.data.value.total;
            }
            $scope.disabled = false;
        })
    };
    $scope.rsvpRemove = function(id, index) {
        $scope.disabled = true;
        $scope.content = bar_data.deleteRSVP(id);
        $scope.content.then(function(payload) {
            if (payload.data.value) {
                $('#'+id).removeClass('hidden');
                $('#'+id+'_remove').addClass('hidden');
                $scope.businesses[index].total = payload.data.value.total;
            }
            $scope.disabled = false;
        })
    };
    $scope.getRSVP = function() {
        $scope.user_get = bar_data.getRSVP();
        $scope.user_get.then(function(payload) {
            if (payload.data) {
                var el = payload.data.github.establishments.length || false;
                var e = payload.data.github.establishments;
                var eleml = $scope.businesses ? $scope.businesses.length : false;
                var element = $scope.businesses
                if (el && eleml) {
                    for (var i = 0; i < eleml; i++) {
                        if (e.indexOf(element[i].id) > -1) {
                            $($('#'+element[i].id+'_remove').removeClass('hidden'));  
                        } else {
                            $($('#'+element[i].id).removeClass('hidden'));
                        }
                    }
                } else {
                    for (var i = 0; i < eleml; i++) {
                          $($('#'+element[i].id).removeClass('hidden'));  
                    }
                }
            }
        });
    };
}]);

myApp.factory('bar_data', function ($http) {
	return {
		grabAll: function (data) {
			return $http.post(window.location.origin+"/api/:id/nightlifely", {location : data });
		}, postRSVP : function(data) {
			return $http.post(window.location.origin+"/api/:id/nightlifely", {id : data });
		}, deleteRSVP : function(data) {
			return $http({
			    url : window.location.origin+"/api/:id/nightlifely",
			    method : 'DELETE',
			    data : {id :data},
			    headers: {"Content-Type": "application/json;charset=utf-8"}
			    });
		}, getRSVP : function() {
		    return $http.get(window.location.origin+"/api/:id/nightlifely");
		}
	};
});