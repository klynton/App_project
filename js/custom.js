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

		commitButton:$('#commitArraySave'),

		logSelect:$('#logSelection'),

		latestEntry:$('#latestEntry'),

		commitList:$('#commitArrayList'),

		resetTimer:undefined,

		resetCounter:2,

		resetLimit:0,

		saveStateField:$('#saveState'),

		saveStatus:undefined,

		clearText:$('#clearTextBox'),

		/***********************
		METHODS
		************************/

		commitToArray:function(e)
		{

			if(this.textField.val().trim() !== "")
			{

				var newLog = {

					"log":"Log_" + (this.commitArray.length + 1),

					"content":this.textField.val()
				};

				//push latest textfield value to end of array
					this.commitArray.push(newLog);

				// 	//save array in localStorage object
					localStorage.commitArray = JSON.stringify(this.commitArray);

				// 	//inject new information from list array to page HTML
				 	this.commitOneLine();

			}

			//DEV TOOLS//
			var byteValue = "bytes", storageValue = sizeof(localStorage.commitArray);
			if(storageValue > 1000 && storageValue < 1000000)
			{
				byteValue = "kilobytes";
				storageValue /= 1000;
			}
			else if(storageValue > 1000000)
			{
				byteValue = "megabytes";
				storageValue /= (1000 * 1000);
			}

			$('#byteSize').val(storageValue + " " + byteValue);
			//*****************//
		},

		commitOneLine:function()
		{
			var listItem = $('<li>'),
				pre = $('<pre>'),
				logSelectItem = $('<li>'),
				logAnchor = $('<a>'),
				log = this.commitArray[this.commitArray.length-1].log,
				content = this.commitArray[this.commitArray.length-1].content;

			//assign the latest save text to the pre tag
			pre.text(content);

			//set the list item's id to the current log number
			listItem.attr('id',log)

					//write the log number before appending the pre tag
				    .text(log)

				    //append the pre tag
				    .append(pre);

			//set anchor tag's href to #, set inner text to current log number
			logAnchor.attr('href','#')
					 .text(log);

			//set log item's class to the current log number
			logSelectItem.addClass(log)
						 .append(logAnchor);


			//append new list item and log item to appropriate UL elements
			this.commitList.append(listItem);


			this.logSelect.append(logSelectItem);
		},

		updateFullArray:function()
		{
			var commitArrayList = this.commitList,
				logSelection = this.logSelect;
	

			//clear array list
			commitArrayList.html('');
			//clear log list
			logSelection.html('');

			//iterate through commit array
			for(var i = 0; i < this.commitArray.length;i++)
			{
				var commitListItem = $('<li>'),
					pre = $('<pre>'),
					logSelectItem = $('<li>'),
					logAnchor = $('<a>'),
					log = this.commitArray[i].log,
					content = this.commitArray[i].content;

				//set each logged content to the pre tag
				pre.text(content);

				//set each list item's id to the logged id
				commitListItem.attr('id',log)

								//set each list item's text to the iterated log
							  .text("Log: " + (i+1))

							  	//append the pre tag
							  .append(pre);

				//set anchor tag's href to #
				logAnchor.attr('href','#')

						//set each list item's text to the literated log
						 .text(log);

				//set the list item's class to the iterated log
				logSelectItem.addClass(log)

							//append the log hyperlink
							.append(logAnchor);

				//append the list item to the ul
				commitArrayList.append(commitListItem);

				//append the log hyperlink to the ul
				logSelection.append(logSelectItem);
			}
		},

		savingTimer:function()
		{
			this.resetLimit = parseInt($('#timerSelect').val()) * 1000;


			//every time key is pressed //
				//reset counter to 1
			this.resetCounter = 1;


				//clear the interval - stop the timer
			clearInterval(this.resetTimer);


				//clear the interval for the save status - stop the timer
			clearInterval(this.saveStatus);


				//set save state text to 'typing'
			this.saveStateField.text('typing');


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


					//set save state text to 'saved'
					textObj.saveStateField.text('saved');


					//set interval where a few seconds of inactivity causes save state text to turn 'inactive'
					textObj.saveStatus = setInterval(function(){textObj.saveStateField.text('inactive'); clearInterval(textObj.saveStatus)},840);
				}


			},this.resetLimit);//end of reset interval
		},

		bindEventHandlers:function()
		{
			/***********************
				TEXT COMMIT - EVENT HANDLERS
			*********************/
			this.textField.keydown(function(){textObj.savingTimer();});

			this.loadButton.click(loadCommitedTextField);

			this.commitButton.click(function(){textObj.commitToArray();clearInterval(textObj.resetTimer);});

			//setting jQuery's .on('click') method to textObj.logSelect's list item children
			//handles delegation as well, so that the log hypertext links dont need to
			//be reset with click handlers
			this.logSelect.on("click","li", logClickEvent);

			this.clearText.click(function(e){e.preventDefault();textObj.textField.val('');clearInterval(textObj.resetTimer);});

			$('#loadAjaxSave').click();
		}
	};
})();

textObj.bindEventHandlers();


/************************
TEXT COMMIT - FUNCTIONS
*************************/

function loadCommitedTextField()
{
	var storageArray = JSON.parse(localStorage.commitArray);

	textObj.commitArray = storageArray;

	textObj.updateFullArray();
}

function logClickEvent(event)
{

	event.preventDefault();//disable default click properties of hypertext links

	var value = $(this).attr('class'),//cache the class name only


		//cache jQuery object with the id equal to the link's class name
		correspondingCommitLog = $("#" + value).children('pre');

	//update textfield's text to the value of the selected log
	textObj.textField.val(correspondingCommitLog.text());

	//commit list should scroll down to the top of the element of the selected list item
	textObj.commitList.animate({


		scrollTop: ( 
			correspondingCommitLog.parent()
			.position().top + 
			textObj.commitList
			.scrollTop() 
			)

	});
}

function enableTab(id) {
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) { // tab was pressed

            // get caret position/selection
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = val.substring(0, start) + '\t' + val.substring(end);

            // put caret at right position again
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            return false;

        }
    };
}

enableTab('testTextField');
/**************************/

/***************************
MAIN CONTENT - Purchase Form
**************************/

var purchaseForm = (function(){
	var DEFAULTS = {

	}
	return {
		/****************
		VARIABLES
		****************/
		firstInput:$('#extra-btl'),
		secondInput:$('#cold-btl'),
		thirdInput:$('#garlic-btl'),
		stateSelect:$('#select-state'),
		radioButtons:$('#r-group input[type="radio"]'),
		estimateButton:$('#purchaseTotal'),
		purchaseTotal:$('#totalInput'),
		taxFactor:1,
		/*****************************/

		/*************************
		METHODS
		**************************/

		getNumberOfBottles:function()
		{
			var first = parseInt(this.firstInput.val()),
				second = parseInt(this.secondInput.val()),
				third = parseInt(this.thirdInput.val());
			return (first + second + third);
		},

		calculateTotal:function()
		{
			var first = parseInt(this.firstInput.val()),
				second = parseInt(this.secondInput.val()),
				third = parseInt(this.thirdInput.val()),
				shippingMethod,
				tax = this.taxFactor;

			var methods = $('input[name="method_r"]');

			methods.each(function(){
				if($(this).prop('checked'))
					shippingMethod = $(this).val();
			});

			if(this.stateSelect.val() === "CA") tax = 1.075;

			var shippingCostPer = (shippingMethod === 'free') ? 0 : (shippingMethod === 'usps') ? 2 : (shippingMethod === 'ups') ? 3 : 0;

			var shippingCost = (first + second + third) * shippingCostPer;

			var subtotal = ( (first * 10) + (second * 8) + (third * 10) ) * tax;

			var estimate = subtotal + shippingCost;

			return "$" + (estimate.toFixed(2));
			
		},

		submitHandler:function(event)
		{
			event.preventDefault();

			purchaseForm.purchaseTotal.val(purchaseForm.calculateTotal());
		}
	}
})();

/******************************
PURCHASE FORM - EVENT HANDLERS
*****************************/

$('#purchaseForm').submit(purchaseForm.submitHandler);

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