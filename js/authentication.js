var errors = [],
	requiredFields = [];


$('form#signUpForm').submit(function(e){
	e.preventDefault();
	submitData('signup');
});

$('form#loginForm').submit(function(e){
	e.preventDefault();
	submitData('login');
});

(function(){
	authenticate();
})();

function User(config)
{
	this.username = config.username;
	this.password = config.password;
	this.email = config.email;
	this.id = 0;
}

function submitData(formType)
{
	var formId = (formType === "login") ? "#login" : (formType === "signup") ? "#signUp" : "",
		username = $(formId + "User"),
		email = $(formId + "Email"),
		password = $(formId + "Password"),
		obj = new User({
			"username":username.val(),
			"email":email.val(),
			"password":password.val()
		});

	if(formType === "signup")	

		requiredFields = ["username","email","password"];

	else if(formType === "login")

		requiredFields = ["username","password"];

	localStorage.formType = JSON.stringify(formType);
	localStorage.submission = JSON.stringify(obj);
	localStorage.requiredFields = JSON.stringify(requiredFields);
	location.reload();
}

function authenticate()
{
	if(localStorage.submission)
	{
		console.log('submission');
		var obj = JSON.parse(localStorage.submission),
			fields = JSON.parse(localStorage.requiredFields);
		
		requiredFields = fields;
		if(checkRequiredFields(obj))
		{
			databaseAuthenticate(obj);
		}

		reportErrors();
		localStorage.removeItem('submission');
		localStorage.removeItem('requiredFields');
		localStorage.removeItem('formType');
	}
}

function hasPresence(string){
	return !(string.trim() === "" && string.trim().length <= 0);
}

function checkRequiredFields(object){

	for(var i = 0; i < requiredFields.length;i++)
	{
		var value = object[requiredFields[i]].trim();
		if(!hasPresence(value))
		{
			errors.push(requiredFields[i].toUpperCase() + " can't be blank");
		}
	}

	if(isEmptyArray(errors)) return true;
	else return false;
}

function isEmptyArray(array)
{
	return array.length === 0;
}

function reportErrors(object)
{
	var formErrors = document.getElementById('formErrors');
	formErrors.innerHTML = "";
	if(!isEmptyArray(errors))
	{
		for(var i = 0; i < errors.length;i++)
		{
			formErrors.innerHTML += errors[i] + "</br>";
		}
	}
}

function databaseAuthenticate(obj)
{
	if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);
	if(JSON.parse(localStorage.formType) === "signup")
	{
		if(JSON.parse(localStorage.userDatabase).length > 0)
		{
			if(isAlreadyInDatabase(obj))
			{
				errors.push(obj.username + " already exists");
			}
			else
			{
				pushToDatabase(obj);
				localStorage.loggedIn = "true";
				window.location = "commitApp.html";
			}
		}
		else
		{
			pushToDatabase(obj);
			localStorage.loggedIn = "true";
			window.location = "commitApp.html";
		}
	}
	else if(JSON.parse(localStorage.formType) === "login")
	{
		if(isFoundInDatabase(obj))
		{
			localStorage.loggedIn = "true";
			window.location = "commitApp.html";
		}
		else
		{
			errors.push("Invalid Username/Password");
		}
	}
}

function isAlreadyInDatabase(obj)
{
	var database = JSON.parse(localStorage.userDatabase);
	for(var i = 0; i < database.length;i++)
	{
		if(obj.username === database[i].username) return true;
	}
	return false;
}

function isFoundInDatabase(obj)
{
	var database = JSON.parse(localStorage.userDatabase);
	for(var i = 0; i < database.length;i++)
	{
		if(obj.username === database[i].username && obj.password === database[i].password)
		{
			return true;
		}
	}
	return false;
}

function pushToDatabase(obj)
{
	var database = JSON.parse(localStorage.userDatabase);
	database.push(obj);
	localStorage.userDatabase = JSON.stringify(database);
}

