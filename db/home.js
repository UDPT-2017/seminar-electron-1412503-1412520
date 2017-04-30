const database = require('../db/database');
const {ipcRenderer} = require('electron');
var uInfo = undefined;
var uPeriod = undefined;

ipcRenderer.on('DirectToHome', (event, arg) => {
	console.log(arg);
	uInfo = arg;
	document.getElementById('username').innerHTML = uInfo._id;
	database.getAllPeriod(uInfo._id, function(docs, err){
		if (err === null)
		{
			var events = [];
			for (var i= 0; i<docs.length; i++)
			{
				var event = {start:docs[i]. , allDay: true};
			}
			console.log(docs);
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
	
}

