const database = require('../db/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');
const sw = require('../node_modules/sweetalert/dist/sweetalert.min.js');
const {ipcRenderer} = require('electron');
var docURI = require('docuri');
var uInfo = undefined;


window.onload = function(){

document.getElementById('hoantat').addEventListener('click',()=>{
  var pass = document.getElementById("pass").value;
  var av_period = document.getElementById("av_period").value;
  var mens_cyc = document.getElementById("mens_cyc").value;
  database.updateUser(uInfo._id, pass, mens_cyc, av_period, function(err){
    if (err !== null)
    {
      swal({
          title: "Oops!!",
          text: "Failed to update user",
          type: "error",
          confirmButtonText: "Try again",
          confirmButtonColor: "#DD6B55"
      });
    }
    else
    {
       swal({
            title: "Success!",
            text: "Success",
            type: "success",
            confirmButtonText: "Cool"
            });
    }
  })
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
  document.getElementById('homepage').addEventListener('click', () => {
  ipcRenderer.send('DirectToHomePage', uInfo);
  });

  document.getElementById('periodInsertion').addEventListener('click', () => {
      ipcRenderer.send('DirectToPeriodInsertion', uInfo);
  });

  document.getElementById('periodInfo').addEventListener('click', () => {
  ipcRenderer.send('DirectToPeriodInfo', uInfo);
  });
}

ipcRenderer.on('DirectToUpdateUserReply', (event, arg) => {
  uInfo = arg;
  document.getElementById('username').innerHTML = uInfo._id;
  database.getUser(uInfo._id, "", function(doc, err){
    if(err===null)
    {
      document.getElementById("user_name").value = doc._id;
      document.getElementById("pass").value = doc.Password;
      document.getElementById("av_period").value = doc.AvgPeriod;
      document.getElementById("mens_cyc").value = doc.MentsCycle;
    }
  })
});
