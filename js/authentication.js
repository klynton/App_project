var errors = {},
	requiredFields = [],
	inputLoginPrefix = "login_",
	inputSignupPrefix = "signup_",
	errorsSuffix = "_errors";

$('form#signUpForm').submit(function(e){
	e.preventDefault();
	authenticate(inputSignupPrefix,errorsSuffix,e);
});

$('form#loginForm').submit(function(e){
	e.preventDefault();
	authenticate(inputLoginPrefix,errorsSuffix,e);
});

function errorsAnimation()
{
	$.each($('[id$="_errors"]'),function(val, key){
		$(this).toggleClass('dismissed');
	});
	setTimeout(function(){
		$.each($('[id$="_errors"]'),function(val, key){
			$(this).toggleClass('dismissed');
		});
	},140);
}

function authenticate(inputPrefix,errorsSuffix,event)
{
	errors = {};
	var prefixFields = $('[id^="' + inputPrefix + '"]'),
		prefixSpliceLength = inputPrefix.length;
	for(var i = 0; i < prefixFields.length; i++)
	{
		requiredFields[i] = prefixFields[i].id.substr(prefixSpliceLength);
	}
	
	var obj = new User();
	for(var i = 0; i < requiredFields.length; i++)
	{
		obj[requiredFields[i]] = $( '#' + inputPrefix + requiredFields[i] ).val();
	}

	if(requiredFieldsExist(obj)) 
	{
		if(event.target.id === "loginForm")
		{
			if(isFoundInDatabase(obj))
			{
				userLogin();
			}
			else
			{
				var values = "";
				for(var i = 0; i < requiredFields.length;i++)
				{
					values += requiredFields[i];

					if(i < requiredFields.length - 1) values += "/";
				}

				values += " invalid";

				for(var i = 0; i < requiredFields.length;i++)
				{
					var value = obj[requiredFields[i]];
					errors[requiredFields[i]] = values;
				}
			}
		}
		else if(event.target.id === "signUpForm")
		{
			if(isAlreadyInDatabase(obj))
			{
				errors["username"] = obj.username + " already exists ";
			}
			else
			{
				pushToDatabase(obj);
				userLogin();
			}
		}
	}

	reportErrors();

	$('[id^="' + inputPrefix + '"').val('');
}

function hasPresence(string)
{
	return !(string === "" && string.length <= 0);
}

function requiredFieldsExist(obj)
{
	for(var i = 0; i < requiredFields.length;i++)
	{
		var value = obj[requiredFields[i]].trim();
		if(!hasPresence(value))
		{
			errors[requiredFields[i]] = requiredFields[i] + " cant be blank";
		}
	}

	if(isEmptyObject(errors)) return true;
	else return false;
}

function isFoundInDatabase(obj)
{
	if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);
	var database = JSON.parse(localStorage.userDatabase);
	for(var i = 0; i < database.length;i++)
	{
		if(obj.username === database[i].username && obj.password === database[i].password) return true;
	}
	return false;
}

function isAlreadyInDatabase(obj)
{
	if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);
	var database = JSON.parse(localStorage.userDatabase);
	for(var i = 0; i < database.length;i++)
	{
		if(obj.username === database[i].username) return true;
	}
	return false;
}

function pushToDatabase(obj)
{
	if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);
	var database = JSON.parse(localStorage.userDatabase);
	database.push(obj);
	localStorage.userDatabase = JSON.stringify(database);
}

function userLogin()
{
	window.location = "commitApp.html";
}

function isEmptyObject(object)
{
	for(var prop in object)
	{
		if(object.hasOwnProperty(prop)) return false;
	}
	return true;
}

function User(config){}

function reportErrors()
{
	$('[id$="' + errorsSuffix + '"]').text('');
	if(!isEmptyObject(errors))
	{
		for(var prop in errors)
		{
			var $error_element = $( "#" + prop + errorsSuffix);
			$error_element.text(errors[prop]);
		}

		errorsAnimation();
	}
}

