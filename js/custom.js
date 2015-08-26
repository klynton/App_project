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
		logSelect:$('.catchText div:first-child'),
		latestEntry:$('.catchText div + div'),
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

				//reset all possible option tags with 'selected' properties
				this.logSelect.children()
							  .children('option')
							  .attr('selected',false);

				//update very last option tag and assign 'selected' property
				this.logSelect.children()
							  .children('option:last-child')
							  .attr('selected',true);
				

				//assign onChange event handler to updated select tag
				this.logSelect.children('select').change(function(){
					var test = $(this).children('option:selected').attr('class');
					//set Latest Entry slot to display 'selected option''s text value
					$(this).parent().next().text($(this).val());
					//update text box to show the same value as 'selected option'
					textObj.textField.val($(this).val());

					$('#commitArrayList').animate( { scrollTop: ( $( "#" + test ).position().top + $('#commitArrayList').scrollTop() ) } );
				});
			}

			console.log(e.keyCode);
		},

		updateArrayList:function()
		{
			//create select tag and ol tag
			var list = "<ol>",
				listSelect = "<select>";

			for(i = 0; i < this.commitArray.length;i++)
			{
				//assign list items and option items containing the recorded 
				//values of committed array

				list += "<li id ='Log_" + (i+1) + "'>" + 
				(i+1) + " : " +
				this.commitArray[i] + "</li>";

				listSelect += "<option " +
				"value = \"" + this.commitArray[i] + "\" " + 
				"class= \"Log_" + (i+1) + "\" >" +
				"Log: " + (i+1) +
				"</option>";
			}

			list += "</ol>";
			listSelect += "</select>";

			//inject ordered list
			this.commitList
				.html(list);

			//inject select tag with options
			this.logSelect.html(listSelect);
			
			//update latest entry slot with very last item of array
			this.latestEntry.html(this.commitArray[this.commitArray.length-1]);

			console.log(textObj.logSelect.children().children('option:last-child').val());
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
			$(this).next().text($(this).children().val());
			textObj.textField.val($(this).children().val());
		});
	}
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

$(document).mousemove(function(event){
	//console.log(event.pageX + " : " + event.pageY);
});

