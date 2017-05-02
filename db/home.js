const database = require('../db/database');
const {ipcRenderer} = require('electron');
var docURI = require('docuri');
var uInfo = undefined;
var uPeriod = undefined;
var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');

function checkPeriod(){
	var todayMonth = new Date().getMonth() + 1;
	console.log(todayMonth);
	var res = [];
	var len = 15 + uInfo._id.length;
	for(var i=0; i < uPeriod.length; i++)
	{
		if ((uPeriod[i]._id.search(todayMonth) > (len - 1)) && (uPeriod[i]._id.search(todayMonth) < (len + 4)))
		{
			res.push(uPeriod[i]);
		}
	}
	return res;
}

function findLatestPeriod(periods){
	var res = periods[0];
	var obj1, obj2;
	for (var i=0; i < periods.length - 1; i++)
	{
		obj1 = periodIDs(periods[i]._id);
		var date1 =  new Date(obj1.FirstDay);
		for (var j=1; j < periods.length; j++)
		{
			obj2 = periodIDs(periods[j]._id);
			var date2 = new Date(obj2.FirstDay);
			if (date2 > date1)
			{
				console.log('haha');
				res = periods[j];
			}
		}
	}
	return res;
}

function convertIntoDate(num){
	var res = undefined;
	var numm = undefined;
	var temp = num;
	while (temp % 10 !== 0)
	{
		numm = temp % 10;
		temp = temp/10;
	}
	switch (numm)
	{
		case 1:
			res = "st";
			break;
		case 2:
			res = "nd";
			break;
		case 3:
			res = "rd";
			break;
		default:
			res = "th";
	}
	return(num + numm);
}

function updateOnScreen(){
	var thisMonthPeriod =  checkPeriod();
	if (thisMonthPeriod.length > 0)
	{
		var latestPerirod = findLatestPeriod(thisMonthPeriod);
		if (latestPerirod.LastDay !== "")
		{

		}
		else
		{

		}
		document.getElementById('note').innerHTML = "You've got period this month";
	}
	else
	{
		console.log('no');
	}
}

ipcRenderer.on('DirectToHome', (event, arg) => {
	console.log(arg);
	uInfo = arg;
	document.getElementById('username').innerHTML = uInfo._id;
	database.getAllPeriod(uInfo._id, function(docs, err){
		if (err === null)
		{
			uPeriod = docs;
			var events = getEvents(uPeriod);
			$(document).ready(function() {
	   			$('#calendar').fullCalendar({
	   		 events: events,
			 dayClick: function() {
        	 if (event.url) {
            window.open(event.url);
            return false;

        	}},
        	editable: true,
        	eventRender: function(event, element, calEvent) {
            element.find(".fc-title").after($("<span ></span>").html("<img src=\"../images/S20.png\"></img>"));}
		
		
	}); })
			updateOnScreen();
			//console.log(docs);
		}else
		{
			console.log(err);
		}
	})
});

window.onload = function (){
	
	document.getElementById('periodInsertion').addEventListener('click', () => {
		ipcRenderer.send('DirectToPeriodInsertion', uInfo)
	});

	document.getElementById('periodInfo').addEventListener('click', () => {
		ipcRenderer.send('DirectToPeriodInfo', uInfo)
	});



	document.getElementById('logOut').addEventListener('click', () => {
		swal({
	  	title: "Wait!!",
	  	text: "Are you sure you want to log out??",
	  	type: "warning",
	  	confirmButtonText: "Yes",
	  	cancelButtonText: "Nah, I don't think so",
	  	showCancelButton: true
		},
		function(isConfirm){
			if (isConfirm)
			{
				console.log('kay');
				ipcRenderer.send('LogOut', 1);
			}
			else
				ipcRenderer.send('LogOut', 0);
		});	
	});
}

function getEvents(docs){
	var events = [];
	for (var i=0; i<docs.length; i++)
	{
		
		var obj = periodIDs(docs[i]._id);
		var fDay = new Date(obj.FirstDay);
		if (docs[i].LastDay.localeCompare("") === 0)
		{	
			for (var j=0; j<uInfo.avgPeriod; j++)
			{
				events.push({start: fDay.toISOString().split('T')[0], allDay: true,})
				fDay.setDate(fDay.getDate() + 1);
			}
		}
		else
		{
			
			var lDay = new Date(docs[i].LastDay);
			while (fDay <= lDay)
			{
				events.push({start: fDay.toISOString().split('T')[0], allDay: true,})
				fDay.setDate(fDay.getDate() + 1);
			}
		}
	}
	return events;
}

