// $('input[type="submit"]').click(function(e){
// 	e.preventDefault();
// 	var submission = {
// 		"username": $('#signUpUser').val(),
// 		"email" : $('#signUpEmail').val(),
// 		"password" : $("#signUpPassword").val()
// 	};

// 	localStorage.submission = JSON.stringify(submission);
// });

var errors = {};
var requiredFields = ["username","password","email"];

$('form').submit(function(e){
	e.preventDefault();
	var submission = {
		"username":$("#signUpUser").val(),
		"email":$("#signUpEmail").val(),
		"password":$("#signUpPassword").val()
	};

	localStorage.submission = JSON.stringify(submission);
	location.reload();
});

$(document).ready(function(){
	if(!localStorage.submission) localStorage.submission = JSON.stringify({"username":"","email":"","password":""});
	var POST = JSON.parse(localStorage.submission);
	checkRequiredFields(POST);
	reportErrors();
	console.log(POST);
});

function hasPresence(string)
{
	return !(string.trim() === "" && string.trim().length <= 0);
}

function checkRequiredFields(object)
{
	for(var i = 0; i < requiredFields.length;i++)
	{
		var value = object[requiredFields[i]].trim();
		if(!hasPresence(value))
		{
			errors[requiredFields[i]] = requiredFields[i].toUpperCase() + " can't be blank";
		}
	}
}

function isEmptyObject(obj)
{
	for(var prop in obj)
	{
		if(obj.hasOwnProperty(prop))
		{
			return false;
		}
	}

	return true;
}

function reportErrors()
{
	var form = document.getElementById('formErrors');
	if(isEmptyObject(errors))
	{
		form.innerHTML = "validation Success";
		
		var obj = JSON.parse(localStorage.submission);
		if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);

		var array = JSON.parse(localStorage.userDatabase);
		array.push(obj);
		localStorage.userDatabase = JSON.stringify(array);
		localStorage.submission = JSON.stringify({"username":"","email":"","password":""});
		window.location = "commitApp.html";
	}
	else
	{
		for(var prop in errors)
		{
			form.innerHTML += errors[prop].toLowerCase() + "</br>";
		}
	}
}

