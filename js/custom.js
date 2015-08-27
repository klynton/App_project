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
	}
}

function logClickEvent(event){

	event.preventDefault();

	var value = $(this).attr('class'),
		correspondingCommitLog = $("#" + value);

	textObj.latestEntry.text(correspondingCommitLog.text());
	textObj.textField.val(correspondingCommitLog.text());
	textObj.commitList.animate({
		scrollTop: ( correspondingCommitLog
							   .position().top + 
						textObj.commitList
							   .scrollTop() )
	});
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
