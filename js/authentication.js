var formHandler = (function(){
	return {

		/*********************
			VARIABLES
		*********************/
		errors:{},

		requiredFields:[],

		inputLoginPrefix:"login_",

		inputSignupPrefix:"signup_",

		errorsSuffix: "_errors",

		signUpForm:$('form#signUpForm'),

		loginForm:$('form#loginForm'),

		/***********************
			EVENT HANDLERS
		*************************/

		bindFormSubmits:function()
		{
			//bind both the signup and login forms
			$('form#signUpForm').submit(function(e){
				e.preventDefault();
				var handler = formHandler;
				handler.authenticate(handler.inputSignupPrefix,handler.errorsSuffix,e);
			});

			$('form#loginForm').submit(function(e){
				e.preventDefault();
				var handler = formHandler;
				handler.authenticate(handler.inputLoginPrefix,handler.errorsSuffix,e);
			});
		},

		/***********************
			METHODS
		************************/

		authenticate:function(inputPrefix,errorsSuffix,event)
		{

			//reset the errors list by setting it blank
			this.errors = {};

			//make a variable containing a list of all the elements
			//with ids that begin with the inputPrefix
			var prefixFields = $('[id^="' + inputPrefix + '"]'),

				//cache the string length of the id prefix
				prefixSpliceLength = inputPrefix.length;


			//iterate through the prefixed elements
			for(var i = 0; i < prefixFields.length; i++)
			{
				//splice the input prefix out of the id, and assign what's left of the string
				//as a required field
				this.requiredFields[i] = prefixFields[i].id.substr(prefixSpliceLength);
			}
			
			//create new user
			var obj = new User();

			//iterate through the required input fields
			for(var i = 0; i < this.requiredFields.length; i++)
			{
				//select an id using the input prefix concatenated with the text value of the required input field
				//assign the new user with a property name equal to the current required field
				//then assign that user property with 
				obj[this.requiredFields[i]] = $( '#' + inputPrefix + this.requiredFields[i] ).val();
			}

			//find out if the user has provided input to all the required fields
			if(this.requiredFieldsExist(obj,inputPrefix)) 
			{

				//if they have, determine if the user is on the signup form
				//or the login form
				if(event.target.id === "loginForm")//form's id is the login form
				{

					//determine if the user input matches any of the accounts
					//within the database
					if(this.isFoundInDatabase(obj))
					{

						//if there's a user account match, allow the user to login
						this.userLogin(obj);
					
					}
					else
					{

						//if there's no user match --
						var values = "";

						//-- iterate through the number of required fields--
						for(var i = 0; i < this.requiredFields.length;i++)
						{
							//--make a string comprised of all the required fields--
							values += this.requiredFields[i];

							//--put a slash after each field item except the last one--
							if(i < this.requiredFields.length - 1) values += "/";
						}

						values += " invalid";//--add the word invalid to the very end of the string--

						//--iterate through the required fields --
						for(var i = 0; i < this.requiredFields.length;i++)
						{
							//assign every error field with the string
							this.errors[this.requiredFields[i]] = values;

							//[setting all error fields with the same
							//text will assure that a falsified login user cant 
							//discern their mistakes through the powers of deduction]

						}
					}
				}
				else if(event.target.id === "signUpForm")//form's id is the sign up form
				{

					//check to see if the new user has a matching username in the database
					if(this.isAlreadyInDatabase(obj))
					{
						//if there is a matching username, print to the error list 
						//that the user already exists
						this.errors["username"] = obj.username + " already exists ";
					}
					else
					{
						//if there's no match, push the new user's information to the
						//database and allow the user to log in
						this.pushToDatabase(obj);
						this.userLogin(obj);
					}
				}
			}
			//after all authentications are complete, print all the recorded error messages
			this.reportErrors();

			//iterate through all the input fields with the input prefix and clear their text
			$('[id^="' + inputPrefix + '"').val('');
		},

		errorsAnimation: function()
		{
			//first iterate through all elements with the id suffix of _errors
				//and reset their classes briefly to make the elements disappear
			$.each($('[id$="_errors"]'),function(val, key){
				$(this).addClass('dismissed');
			});

			//quickly trigger the animation with new text
			setTimeout(function(){
				$.each($('[id$="_errors"]'),function(val, key){
					$(this).removeClass('dismissed');
				});
			},140);
		},

		hasPresence:function(string)
		{
			//return true if the string is empty and has no character length
			return !(string === "" && string.length <= 0);
		},

		requiredFieldsExist:function(obj,prefix)
		{

			//iterate through the required fields
			for(var i = 0; i < this.requiredFields.length;i++)
			{
				//cache the object's matching requiredField property trimmed with no white spaces
				var value = obj[this.requiredFields[i]].trim();

				//determine if the trimmed value is blank
				if(!this.hasPresence(value))
				{
					//assign the errors list with a property name equal to the required field's property
					//create a jQuery selector comprised of the id of the prefix concatenated to
					//the text of the HTML label tag with a matching [for] attribute
					this.errors[this.requiredFields[i]] = $("label[for=" + prefix + this.requiredFields[i]).text() + " cant be blank";
				}
			}

			//return true if the errors list is empty
			if(this.isEmptyObject(this.errors)) return true;
			else return false; // return false if the errors list is not empty
		},

		isFoundInDatabase:function(obj)
		{
			//check to see if the database has not yet been created, if not, make an empty array
			if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);

			//make a temp database
			var database = JSON.parse(localStorage.userDatabase);

			//iterate through the parsed database
			for(var i = 0; i < database.length;i++)
			{
				//if the object's username and password match a username and password in the database, return true
				if(obj.username === database[i].username && obj.password === database[i].password) return true;
			}
			//if there's no matching username return false
			return false;
		},

		isAlreadyInDatabase:function(obj)
		{
			//check to see if the database has not yet been created, if not, make an empty array
			if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);

			//make a temp database
			var database = JSON.parse(localStorage.userDatabase);

			//iterate through the database
			for(var i = 0; i < database.length;i++)
			{
				//if the object's username matches a username in the database, return true
				if(obj.username === database[i].username) return true;
			}

			//if there's no matching username return false
			return false;
		},

		pushToDatabase:function(obj)
		{
			//check to see if the database has not yet been created, if not, make an empty array
			if(!localStorage.userDatabase) localStorage.userDatabase = JSON.stringify([]);

			//make a temp database
			var database = JSON.parse(localStorage.userDatabase);

			//push the object to the database 
			database.push(obj);

			//stringify the database and send it back to localstorage
			localStorage.userDatabase = JSON.stringify(database);
		},

		userLogin:function(user)
		{
			user.loggedIn = true;
			localStorage.primaryUser = JSON.stringify(user);

			//assign a sessionStorage property as well to keep the user logged in if they refresh the page
			sessionStorage.primaryUser = JSON.stringify(user,100000);

			//change the window address
			window.location = "commitApp.html";
		},

		isEmptyObject:function(object)
		{
			//iterate through the object
			for(var prop in object)
			{
				//determine if the object has any properties at all
				//if so, return false
				if(object.hasOwnProperty(prop)) return false;
			}
			//if there's no properties inside the object, return true
			return true;
		},

		reportErrors:function()
		{
			//iterate through all the elements with ids ending in the errors suffix
			//and clear their text
			$('[id$="' + this.errorsSuffix + '"]').text('');

			//determine if the errors list is empty
			if(!this.isEmptyObject(this.errors))
			{
				//if not, iterate through the errors object's properties
				for(var prop in this.errors)
				{
					//select the element containing an id with
					//the error lists current property and the error suffix
					var $error_element = $( "#" + prop + this.errorsSuffix);

					//write the text of the selected element with the corresponding error text
					$error_element.text(this.errors[prop]);
				}

				//initiate the animation for the printed errors
				this.errorsAnimation();
			}
		},

		bindPasswordFields:function()
		{
			$("#signup_password").keyup(this.passwordConfirm);
			$("#signup_confirm-password").keyup(this.passwordConfirm);
		},

		passwordConfirm:function()
		{
			var pass1 = $("#signup_password"),
				error1 = $("#password_errors"),
				pass2 = $("#signup_confirm-password"),
				error2 = $("#confirm-password_errors");

			pass2.parent().parent().show();
			if(pass1.val().length === 0)
			{
				$("#signUpSubmit").attr("disabled",false).css("color","rgb(51,51,51)");
			}
			else if(pass1.val().length > 0 && pass1.val().length < 5)
			{
				error1.show().text("password too short");
				$("#signUpSubmit").attr("disabled",true).css("color","#888");
			}
			else
			{
				error1.hide();
				if(pass1.val() === pass2.val())
				{
					pass2.parent().parent().show();
					error2.show().css("color","#6c6").text("passwords match");
					$("#signUpSubmit").attr("disabled",false).css("color","rgb(51,51,51)");
				}
				else
				{
					error2.show().css("color","#f66").text("passwords do not match");
					$("#signUpSubmit").attr("disabled",true).css("color","#888");
				}
			}
			
		},

		updateUserObjects:function()
		{
			var database = JSON.parse(localStorage.userDatabase);
			for(var i = 0; i < database.length;i++)
			{
				var updatedUser = new User();
				for(var prop in database[i])
				{
					updatedUser[prop] = database[i][prop];
				}
				database[i] = updatedUser;
			}

			localStorage.userDatabase = JSON.stringify(database);
		}
	}
})();

function User(){
	this.loggedIn = false;
	this.friendDatabase = [];
}

formHandler.bindFormSubmits();
formHandler.bindPasswordFields();


