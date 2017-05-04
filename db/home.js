const database = require('../db/database');
const {ipcRenderer} = require('electron');
var docURI = require('docuri');
var uInfo = undefined;
var uPeriod = undefined;
var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');

//kiểm tra trong tháng người dùng đã thêm kỳ kinh nguyệt chưa
function checkPeriod(month){
	//var todayMonth = new Date().getMonth() + 1;
	//console.log(todayMonth);
	var res = [];
	var len = 15 + uInfo._id.length;
	for(var i=0; i < uPeriod.length; i++)
	{
		if ((uPeriod[i]._id.search(month) > (len - 1)) && (uPeriod[i]._id.search(month) < (len + 4)))
		{
			res.push(uPeriod[i]);
		}
	}
	return res;
}

//tìm kỳ kinh nguyệt gần nhất trong các kỳ periods
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
				res = periods[j];
			}
		}
	}
	return res;
}

//chuyển số thành số thứ tự
function convertIntoOrder(num){
	var res = undefined;
	var numm = undefined;
	var temp = num;
	while (temp % 10 >= 1)
	{
		numm = temp % 10;
		console.log(numm);
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
	return(num + res);
}

function diffDate(date2, date1){
	//var timeDiff = Math.abs(date1.getTime() - date2.getTime());
	//var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
	var diffDays = date1.getDate() - date2.getDate();
	return diffDays;
}

function getHoursDiff(date2, date1)
{
	var timeDiff = Math.abs(date1.getTime() - date2.getTime());
	var hours = Math.ceil(timeDiff / (60*60*1000));
	return hours;
}

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf());
  dat.setDate(dat.getDate() + days);
  return dat;
}

//hiện thông tin ngày kinh nguyệt và dự đoán
function updateOnScreen(){
	var todayMonth = new Date().getMonth() + 1;
	var thisMonthPeriod =  checkPeriod(todayMonth);
	var tday = new Date();
	var announcement = "";

	if (thisMonthPeriod.length > 0)
	{
		var latestPerirod = findLatestPeriod(thisMonthPeriod);
		var per = periodIDs(latestPerirod._id);
		var fDay = new Date(per.FirstDay);
		var nFirstDay = fDay.addDays(Number(uInfo.MentsCycle));
		if (latestPerirod.LastDay !== "")
		{
			
			var lDay = new Date(latestPerirod.LastDay);
			
			if (lDay >= tday)
			{
				var diffDays = diffDate(fDay, tday);
				announcement = convertIntoOrder(diffDays+1);
				document.getElementById('note').innerHTML = announcement + " Day";
			}
			else
				document.getElementById('note').innerHTML = diffDate(tday, nFirstDay) + " Days Till Your Next Period";
		}
		else
		{
			var diffDays = diffDate(fDay, tday);
			announcement = convertIntoOrder(diffDays+1);
			document.getElementById('note').innerHTML = announcement + " Day";
		}
		document.getElementById('anticipate').innerHTML = "Next Period: " + moment(nFirstDay).format("ddd, MMMM Do YYYY");
	}
	else
	{
		calculateDateDiff();
	}
}

function calculateDateDiff()
{
	var lFDay = getLastPeriodFDay();
	if (lFDay !== null)
	{
		var fDay = new Date(lFDay);
		var tday = new Date();

		var nFirstDay = fDay.addDays(Number(uInfo.MentsCycle));
			console.log(nFirstDay);
			console.log(tday);
		if (getHoursDiff(nFirstDay, tday) < 24)
		{
			if (isNext2EachOther(tday, nFirstDay))
				periodNext2EachOther(tday, nFirstDay);
			else if (tday.getDate() === nFirstDay.getDate())
				document.getElementById('note').innerHTML = "You're Supposed To Have Period On This Day >.<";
		}
		else if (getHoursDiff(nFirstDay, tday) < 48)
		{
			if (isNext2EachOther(tday, nFirstDay))
				periodNext2EachOther(tday, nFirstDay);
			else
				periodDateDiff(nFirstDay, tday);
		}
		else
		{
			periodDateDiff(nFirstDay, tday);
		}
	}
	else
	{
		document.getElementById('note').innerHTML = "There's Nothing To Show.";
		document.getElementById('anticipate').innerHTML = "Please Add Your Period Information :)";
	}
}

//tìm ngày kinh đầu gần nhất mà người dùng đã thêm vào
function getLastPeriodFDay(){
	if (uInfo.LastPeriod !== "")
	{
		var lMonth = new Date().getMonth();
		var lFDay = new Date(uInfo.LastPeriod);
		while (checkPeriod(lMonth).length === 0)
		{
			lMonth -= 1;
			if (lMonth === lFDay.getMonth())
			{
				return uInfo.latestPerirod;
			}
		}
		var per = findLatestPeriod(checkPeriod(lMonth));
		var obj = periodIDs(per._id);
		return obj.FirstDay;
	}
	else
		return null;
}

function isNext2EachOther(date1, date2)
{
	return ((date1.getDate() == (date2.getDate() + 1)) || (date2.getDate() == (date1.getDate() + 1)));
}

function periodNext2EachOther(date1, date2)
{
	if (date1.getDate() == (date2.getDate() + 1))
		document.getElementById('note').innerHTML = "You're Supposed To Have Period Yesterday >.<";
	else if (date2.getDate() == (date1.getDate() + 1))
		document.getElementById('note').innerHTML = "You May Have Your Period Tommorrow :D";
}

function periodDateDiff(date1, date2)
{
	if (date1 > date2)
		{
			document.getElementById('note').innerHTML = diffDate(date2, date1) + " Days Till Your Next Period";
			document.getElementById('anticipate').innerHTML = "Next Period: " + moment(date1).format("ddd, MMMM Do YYYY");
		}
		else
		{
			document.getElementById('note').innerHTML = "You're Supposed To Have Period " + diffDate(date1, date2) + " Days Ago >.<";
		}
}

ipcRenderer.on('DirectToHome', (event, arg) => {
	//console.log(arg);
	uInfo = arg;
	document.getElementById('username').innerHTML = uInfo._id;
	
	//database.updateUser(uInfo._id, '1234', '2017-04-10', '23', '4');
	

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

	document.getElementById('updateUser').addEventListener('click', () => {
	      ipcRenderer.send('DirectToUpdateUser', uInfo);
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
		//var lDay = new Date();
		if (docs[i].LastDay.localeCompare("") === 0)
		{	
			if ((fDay.getMonth() === new Date().getMonth()) && (fDay.getFullYear() === new Date().getFullYear()))
			{
				//lDay.setDate(fDay.getDate() + Number(uInfo.avgPeriod));
				var lDay = new Date();
				//lDay.setDate(docs[i].LastDay);
				while (fDay.getDate() <= lDay.getDate())
				{
					events.push({start: fDay.toISOString().split('T')[0], allDay: true});
					fDay.setDate(fDay.getDate() + 1);
				}
			}
			else
			{
				console.log(uInfo.AvgPeriod);
				for (var j=0; j < Number(uInfo.AvgPeriod); j++)
					{
						events.push({start: fDay.toISOString().split('T')[0], allDay: true});
						fDay.setDate(fDay.getDate() + 1);
					}
			}
			
		}
		else
		{
			
			var lDay = new Date(docs[i].LastDay);
			//lDay.setDate(docs[i].LastDay);
			while (fDay.getDate() <= lDay.getDate())
			{
				events.push({start: fDay.toISOString().split('T')[0], allDay: true});
				fDay.setDate(fDay.getDate() + 1);
			}
		}
		
	}
	console.log(events);
	return events;
}

