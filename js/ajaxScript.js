var request = new XMLHttpRequest();
var request2 = new XMLHttpRequest();
request.open('GET','js/data.json');
var $enviroment = $('#enclosedAjaxEnviroment');

request.onreadystatechange = function()
{
	if(request.status === 200 && request.readyState===4)
	{
		var items = JSON.parse(request.responseText);
		console.log(items);
		var output = "<ul>";
		for(var key in items)
		{
			output += "<li>" + items[key].name + "</li>";
		}
		output += "</ul>";
		$enviroment.html(output);
	}
}

//request.send();

request2.open('GET','js/data.txt');

request2.onreadystatechange = function()
{
	if(request2.status === 200 && request2.readyState === 4)
	{
		console.log(request2.responseText);
	}
}

request2.send();

function loadAjax()
{
	var request3 = new XMLHttpRequest();
	request3.open('GET','js/data.xml');
	request3.onreadystatechange = function()
	{
		if(request3.status === 200 && request3.readyState === 4)
		{
			var xml = request3.responseXML;
			var items = document.getElementsByTagName('li');
			for(var i = 0; i < xml.getElementsByTagName('name').length;i++)
			{
				items[i].innerHTML = xml.getElementsByTagName('name')[i].innerHTML;
			}
		}
	}

	request3.send();
}

$('#loadAjax').click(loadAjax);
$('#enclosedAjaxEnviroment ul li').load('js/data.txt');
$.getJSON('js/data.json',function(data){
	var output = "<ul>";
	$.each(data,function(key,val){
		output += "<li>" + val.name + "</li>";
	});
	output += "</ul>";
	$('#enclosedAjaxEnviroment').append(output);
});

$('#search').keyup(function(){
	var searchField = $('#search').val();
	var myExp = new RegExp(searchField, "i");
	$.getJSON('js/data2.json',function(data){
		var output = "<ul class='searchresults'>";
		$.each(data,function(key,val){
			if(val.name.search(myExp) != -1 ||
			   val.bio.search(myExp) != -1){
				output += "<li>";
				output += "<h2>" + val.name + "</h2>";
				output += "<p>ShortName: " + val.shortname + "</p>";
				output += "<p>Bio: " + val.bio + "</p>"; 
				output += "</li>";
			}
		});
		output += "</ul>";
		$('#searchDump').html(output);
	});
});

$('#enclosedAjaxEnviroment').hide();

function loadAjaxSave()
{
	var commitXHR = new XMLHttpRequest();

	commitXHR.open('GET','js/dataCommit.json');

	commitXHR.onreadystatechange = function()
	{
		if(commitXHR.status === 200 && commitXHR.readyState === 4)
		{
			var obj = JSON.parse(commitXHR.responseText);
			textObj.commitArray = obj;
			textObj.updateFullArray();
		}
	}

	commitXHR.send();
}
$('#loadAjaxSave').click(loadAjaxSave);