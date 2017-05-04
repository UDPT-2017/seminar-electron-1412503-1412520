const database = require('../db/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');
const {ipcRenderer} = require('electron');
var uInfo = undefined;

var d = new Date();
var today = (d.getDate()/d.getMonth()/d.getFullYear());
$(document).ready(
function () {
  $( "#start" ).datepicker({
    maxDate: today,
    dateFormat: "dd/mm/yy",
    onSelect : function(selected_date){
      document.getElementById("end").disabled = false;		//enable ngày kết thúc
      document.getElementById("hoantat").disabled = false;//enable button hoàn tất
      var selectedDate = new Date(selected_date);

      $("#end").datepicker( "option", "minDate", selected_date );	//end>start
      $("#end").val(""); //set giá trị end về rỗng khi start thay đổi
     document.getElementById("kykinh").innerHTML = "";	//set giá trị kỳ kinh về rỗng khi start thay đổi
    }
  }).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
  $('#end').datepicker({
    dateFormat: "dd/mm/yy"
  }).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');
}
);

//tính chu kỳ kinh kéo dài
function myFunction() {
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
  var x = $("#start").val().split("/");
  var y = $("#end").val().split("/");

  var start = new Date(x[2], x[1] - 1, x[0]);
  var end = new Date(y[2], y[1] - 1, y[0]);
  var kykinh = Math.round((end.getTime() - start.getTime())/oneDay) + 1;
  document.getElementById("kykinh").innerHTML = kykinh;
}

function convertDayFormat(date){
  var x = date.split("/");
  return (x[2] + '-' + x[1]  + '-' + x[0]);
}
window.onload = function (){
  // Add the add button click event
  document.getElementById('hoantat').addEventListener('click', () => {

    // Retrieve the input fields
    var username = uInfo._id;
    var x = $("#start").val();
    var y = $("#end").val();

    var start = convertDayFormat(x);
    var end = convertDayFormat(y);
    if(end==="undefined-undefined-"){
        end=""
    }

    // Save the person in the database
    database.addPeriod(username, start, end, function(err){
      if (err !== null)
      {
        swal({
            title: "Oops!!",
            text: "You've already got this information recorded!",
            type: "error",
            confirmButtonText: "Try again",
            confirmButtonColor: "#DD6B55"
        });
      }
      else
      {
         swal({
              title: "Success!",
              text: "A new record is inserted!",
              type: "success",
              confirmButtonText: "Cool"
              });
      }
    });
    // Reset the input fields
    $("#end").val("");
    $("#start").val("");
    document.getElementById("kykinh").innerHTML = "";
  });

  document.getElementById('updateUser').addEventListener('click', () => {
      ipcRenderer.send('DirectToUpdateUser', uInfo);
  });

  document.getElementById('homepage').addEventListener('click', () => {
  ipcRenderer.send('DirectToHomePage', uInfo);
  });

  document.getElementById('periodInfo').addEventListener('click', () => {
  ipcRenderer.send('DirectToPeriodInfo', uInfo);
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

ipcRenderer.on('DirectToPeriodInsertionReply', (event, arg) => {
  console.log(arg);
  uInfo = arg;
  document.getElementById('username').innerHTML = uInfo._id;
});
