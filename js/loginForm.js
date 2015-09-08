var requiredFields = ["username","password"];
var errors = {};

$('form').submit(function(e){
	e.preventDefault();
	var submission = {
		"username":$("#loginUser").val(),
		"password":$("#loginPassword").val()
	};

	localStorage.submission = JSON.stringify(submission);
	location.reload();
});

$(document).ready(function(){
	if(!localStorage.submission) localStorage.submission = JSON.stringify({"username":"","password":""});
	var POST = JSON.parse(localStorage.submission);
	checkRequiredFields(POST);
	reportErrors();
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
		form.innerHTML = "login Success";
		if(searchDatabase()) 
		{
			window.location = "commitApp.html";
		}
		localStorage.submission = JSON.stringify({"username":"","email":"","password":""});
	}
	else
	{
		for(var prop in errors)
		{
			form.innerHTML += errors[prop].toLowerCase() + "</br>";
		}
	}
}

function searchDatabase()
{
	var database = JSON.parse(localStorage.userDatabase);
	var submission = JSON.parse(localStorage.submission);
	for(var i = 0; i < database.length;i++)
	{
		if(submission.username === database[i].username && submission.password === database[i].password)
		{
			return true;
		}
	}
	return false;
}