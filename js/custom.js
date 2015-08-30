/****************************
	TEXT COMMIT OBJECT
******************************/

var textObj = (function(){
	return {

		/**********************
		VARIABLES
		**********************/
		textField:$('#testTextField'),
		commitArray:[],
		loadButton:$('#commitArrayLoad'),
		logSelect:$('#logSelection'),
		latestEntry:$('#latestEntry'),
		commitList:$('#commitArrayList'),
		resetTimer:undefined,
		resetCounter:2,
		resetLimit:1000,

		/***********************
		METHODS
		************************/

		commitToArray:function(e)
		{

			//push latest textfield value to end of array
				this.commitArray.push(this.textField.val());

			// 	//set backlog limit
				if(this.commitArray.length > 100)
					this.commitArray.shift(); //remove oldest recorded log

			// 	//save array in localStorage object
				localStorage.commitArray = JSON.stringify(this.commitArray);

			// 	//inject information from list array to page HTML
			 	this.updateArrayList();
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

		savingTimer:function()
		{
			//every time key is pressed //
				//reset counter to 1
			this.resetCounter = 1;
				//clear the interval - stop the timer
			clearInterval(this.resetTimer);
				//re-set the interval function - reset the timer
			this.resetTimer = setInterval(function(){
				//decrement the timer by 1
				textObj.resetCounter--;
				//once the timer reaches 0,
				if(textObj.resetCounter === 0)
				{	
					//stop the timer, 
					clearInterval(textObj.resetTimer);
					//commit the current text value of the textField to the logs
					textObj.commitToArray();
				}
			},this.resetLimit);
		}
	};
})();

/***********************
	TEXT COMMIT - EVENT HANDLERS
*********************/
textObj.textField.keydown(function(){textObj.savingTimer();});

textObj.loadButton.click(loadCommitedTextField);

//setting jQuery's .on('click') method to textObj.logSelect's list item children
//handles delegation as well, so that the log hypertext links dont need to
//be reset with click handlers
textObj.logSelect.on("click","li", logClickEvent);

/************************
TEXT COMMIT - FUNCTIONS
*************************/

function loadCommitedTextField()
{
	var storageArray = JSON.parse(localStorage.commitArray);

	textObj.commitArray = storageArray;

	textObj.updateArrayList();
}

function logClickEvent(event)
{

	event.preventDefault();//disable default click properties of hypertext links

	var value = $(this).attr('class'),//cache the class name only
		correspondingCommitLog = $("#" + value);//cache jQuery object with the id 
												//equal to the link's class name

	//set the latestEntry to the commit list with corresponding 
	//id to the clicked link's class
	textObj.latestEntry.text(correspondingCommitLog.text());

	//update textfield's text to the value of the selected log
	textObj.textField.val(correspondingCommitLog.text());

	//commit list should scroll down to the top of the element of the selected list item
	textObj.commitList.animate({
		scrollTop: ( correspondingCommitLog
							   .position().top + 
						textObj.commitList
							   .scrollTop() )
	});
}

/**************************/

/***************************
MAIN CONTENT - Purchase Form
**************************/

var purchaseForm = (function(){
	
})();

/************************/

$(document).click(function(e){
	if( regulateNavMenuNotSelected(e) )
	{
		$('.slideOutMenu').toggleClass('active');
	}
});

$('.slideOutToggle').click(function(event){
	var nextElement = $(this).next();
	nextElement.toggleClass('active');
});

$('.slideOutMenu a').click(function(event){
	var grandParentElement = $(this).parent().parent();
	grandParentElement.toggleClass('active');
});


function regulateNavMenuNotSelected(e)
{
	var containers = $('.slideOutMenu,.slideOutToggle');
	return( !containers.is(e.target) && 
			containers.has(e.target).length === 0 &&
			containers.hasClass('active') );
}