'use strict';

//function updateClickCount (data) {
//      console.log(data);
//};

function getMe() {
    /*
    var object_input = {};
	var multi_input_value = document.getElementsByClassName('new_poll');
    for (var val = 0; val < multi_input_value.length; val++) {
        if (multi_input_value[val] !== undefined) {
            object_input[val] = {name : multi_input_value[val].value, total : 0};
        }
    }
	//console.log(object_input);
    */
    var values = []
	
		
	    $('.new_poll').each(function() {
		values.push({name : $(this).val(), total : 0 });
	});
	//console.log(values);
	


    var git_users_url = 'https://web-voting-adamjo.c9users.io/api/:id/users'
           ajaxFunctions.ajaxRequest('POST', git_users_url, function (data) {
               //console.log(data);
    }, values);
    

    var signup_btn = $('.signup_btn');
    var user_email = $('#signup_name').val();

	//console.log(values);
    //return values;
};

//(function () {
    
    //var name = document.querySelector('#signup_name').value;
    //console.log(signup_btn.html());
    //console.log(user_email);
//    var apiUrl = appUrl + '/api/:id/';
    //console.log(apiUrl);
//})();