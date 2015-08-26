/****************************
	TEXT COMMIT OBJECT
******************************/

var textObj = (function(){
	var DEFAULTS = {
		
	};
	return {

		/**********************
		VARIABLES
		**********************/
		textField:$('#testTextField'),
		commitArray:[],
		selectedArrayItem:0,
		arrayFocus:false,
		loadButton:$('#commitArrayLoad'),
		logSelect:$('#logSelection'),
		latestEntry:$('#latestEntry'),
		commitList:$('#commitArrayList'),

		/***********************
		METHODS
		************************/

		commitToArray:function(e)
		{
			e.preventDefault();

			//prevent unpermitted keys (arrow keys etc) from committing
			if(this.isPermittedKey(e))
			{
				//push latest textfield value to end of array
				this.commitArray.push(this.textField.val());

				//set backlog limit
				if(this.commitArray.length > 500)
					this.commitArray.shift(); //remove oldest recorded log

				//save array in localStorage object
				localStorage.commitArray = JSON.stringify(this.commitArray);

				//inject information from list array to page HTML
				this.updateArrayList();

				//reset all possible list items tags with 'selected' properties
				this.logSelect.children('li')
							  .attr('selected',false);

				//update very last list item and assign 'selected' property
				this.logSelect.children('li:last-child')
							  .attr('selected',true);
				
			}

			console.log(e.keyCode);
		},

		updateArrayList:function()
		{
			//create select tag and ol tag
			var commitArrayList = "",
				logSelectionList = "";

			for(i = 0; i < this.commitArray.length;i++)
			{
				//assign list items containing the recorded 
				//values of committed array

				commitArrayList += "<li id ='Log_" + (i+1) + "'>" + 
				(i+1) + " : " +
				this.commitArray[i] + "</li>";

				logSelectionList += "<li " + 
				"class= \"Log_" + (i+1) + "\" >" +
				"<a href='#'>" +
				"Log: " + (i+1) + 
				"</a>" + "</li>";
			}

			//inject ordered list
			this.commitList.html(commitArrayList);

			//inject ul tag with list items
			this.logSelect.html(logSelectionList);
			
			//update latest entry slot with very last item of array
			this.latestEntry.html(this.commitArray[this.commitArray.length-1]);
		},

		isPermittedKey:function(e)
		{
			//cache keyCode / e.keyCode for standard browsers / e.charCode for safari
			var keyCode = (e.keyCode) ? e.keyCode : e.charCode,
				restricted = [37,38,39,40,20];
				//iterate through list of restricted keys, break loop and return false if matched
				for(var i = 0; i < restricted.length;i++)
					if(keyCode === restricted[i]) return false;
				return true;
		},
	};
})();

/***********************
	TEXT COMMIT - EVENT HANDLERS
*********************/
textObj.textField.keyup(function(event){textObj.commitToArray(event);});

textObj.loadButton.click(loadCommitedTextField);

textObj.logSelect.on("click","li", logClickEvent);

/************************
TEXT COMMIT - FUNCTIONS
*************************/

function loadCommitedTextField()
{

	if(localStorage.commitArray)
	{
		var storageArray = JSON.parse(localStorage.commitArray);

		textObj.commitArray = storageArray;

		textObj.updateArrayList();

		textObj.logSelect.children().children().attr('selected',false);

		textObj.logSelect.children().children('option:last-child').attr('selected',true);

		textObj.textField.val(textObj.logSelect.children().children('option:last-child').val());

		textObj.logSelect.change(function(){
			var test = $(this).children().children('option:selected').attr('class');
			$(this).next().text($(this).children().val());
			textObj.textField.val($(this).children().val());

			$('#commitArrayList').animate( { scrollTop: ( $( "#" + test ).position().top + $('#commitArrayList').scrollTop() ) } );
		});
	}
}

function logClickEvent(event){
	event.preventDefault();
	var value = $(this).attr('class'),
		correspondingCommitLog = $("#" + value);

	$('#latestEntry').text(correspondingCommitLog.text());
	textObj.textField.val(correspondingCommitLog.text());
	textObj.commitList.animate({
		scrollTop: ( correspondingCommitLog
							   .position().top + 
						textObj.commitList
							   .scrollTop() )
	});
	//$(correspondingCommitLog).css('background-color','#0000FF');
	
	/*
	//set Latest Entry slot to display 'selected' text value
	$('#latestEntry').text($(this).val());
	
	var test = $(this).children('option:selected').attr('class');
	
	$(this).parent().next().children().text($(this).val());
	//update text box to show the same value as 'selected item'
	textObj.textField.val($(this).val());
	*/

	//$('#commitArrayList').animate( { scrollTop: ( $( correspondingCommitLog ).position().top + $('#commitArrayList').scrollTop() ) } );
}

/**************************/


$(document).click(function(e){
	if( regulateNavMenuNotSelected(e) )
	{
		$('.slideOutMenu').toggleClass('active');
	}
});

$('.slideOutToggle').click(function(event){
	$(this).next().toggleClass('active');
});

$('.slideOutMenu a').click(function(event){
	$(this).parent().parent().toggleClass('active');
});


function regulateNavMenuNotSelected(e)
{
	var containers = $('.slideOutMenu,.slideOutToggle');
	return( !containers.is(e.target) && 
			containers.has(e.target).length === 0 &&
			containers.hasClass('active') );
}


function compareBytes(object,byteLimit)
{
	while(sizeof(object) > byteLimit) 
	{
		object = object.substring(0,object.length - 1);
	}
	return object + " : " + object.length;
}

/******************************
	TO DO LIST
*******************************/

//change log selection option tags to hypertext links
//make object variables more accessible
//shorten chained methods by use of variables
//do not assign log selection values with entire textfield text
//make log selection links assign values based on commitArrayList logs
//refactor sloppy code
//delete deprecated variables/methods/functions
