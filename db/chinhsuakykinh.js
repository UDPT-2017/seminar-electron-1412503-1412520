const database = require('../db/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');
const sw = require('../node_modules/sweetalert/dist/sweetalert.min.js');
const {ipcRenderer} = require('electron');
var uInfo = undefined;
var docURI = require('docuri');

$('#end').datepicker({
  dateFormat: "dd/mm/yy"
}).datepicker('widget').wrap('<div class="ll-skin-lugo"/>');

yymmddToddmmyy = function(date){
  var x = date.split("-");
  return (x[2] + '/' + x[1]  + '/' + x[0]);
};
ddmmyyToyymmdd = function(date){
  var x = date.split("/");
  return (x[2] + '-' + x[1]  + '-' + x[0]);
};

function convertDaytoCompareD(date){
  var x = date.split("/");
  return (new Date(x[2], x[1]-1, x[0])).getTime();
}

function convertDaytoCompareY(date){
  var x = date.split("-");
  return (new Date(x[0], x[1]-1, x[2])).getTime()
}

  //tính chu kỳ kinh kéo dài
  function myFunction() {
    if(($("#end").val())===""){
      document.getElementById("kykinh").innerHTML = "";
    }
    else {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var x = $("#all_start").val().split("/");
    var y = $("#end").val().split("/");
      var start = new Date(x[2], x[1] - 1, x[0]);
      var end = new Date(y[2], y[1] - 1, y[0]);
      var kykinh = Math.round((end.getTime() - start.getTime())/oneDay) + 1;
      document.getElementById("kykinh").innerHTML = kykinh;
    }
  }

  function cancelEdit(){
    window.location.reload(true);
  }

window.onload = function() {

    document.getElementById('cancelEdit').addEventListener('click', () => {
      $("#all_start").val("-- Select period --");
      document.getElementById("kykinh").innerHTML = "";
      document.getElementById("end").value = "";
      document.getElementById("end").disabled = true;
      document.getElementById("hoantat").disabled = true;
      document.getElementById("xoa").disabled = true;
    })

     //Lưu thay đổi
    document.getElementById('hoantat').addEventListener('click', () => {
      var x = $("#all_start").val();
      var y = $("#end").val();
      var end = "";
      var kq = 1;
      database.getAllPeriod(uInfo._id, function(res, err){
          var tam1 = convertDaytoCompareD(x);
          var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
          outloop:
          for (var i = 0; i <res.length; i++){
            var s = convertDaytoCompareY(periodIDs(res[i]._id).FirstDay);

            if(res[i].LastDay !==""){
              var e = convertDaytoCompareY(res[i].LastDay);
              if(tam1 > s && tam1 <= e){
                kq = 0;
                break outloop;
              }
            }

            if(y!==""){
              var tam2 = convertDaytoCompareD(y);
              if(s>tam1 && s<=tam2){
                kq = 0;
                break outloop;
              }
            }
          }

          if(kq===1){
            x = ddmmyyToyymmdd(x);
            if(y!==""){
                y = ddmmyyToyymmdd(y);
            }
            // Update
            database.updatePeriod(uInfo._id, x, y, function(err){
              if (err !== null)
              {
                swal({
                    title: "Oops!!",
                    text: "Failed to update period!!",
                    type: "error",
                    confirmButtonText: "Try again",
                    confirmButtonColor: "#DD6B55"
                });
              }
              else
              {
                 swal({
                      title: "Success!",
                      text: "Update your period info successfully!!",
                      type: "success",
                      confirmButtonText: "Cool"
                      });
              }
            });
          }
          else{
            swal({
                title: "Overlap period",
                text: "Failed to update period!!",
                type: "error",
                confirmButtonText: "Try again",
                confirmButtonColor: "#DD6B55"
            });
          }

      })

    })

    //Xóa kỳ kinh
    document.getElementById('xoa').addEventListener('click', () => {
      var x = ddmmyyToyymmdd($("#all_start").val());
      database.deletePeriod(uInfo._id, x, function(err){
        if (err !== null)
        {
          swal({
              title: "Oops!!",
              text: "Failed to delete period!!",
              type: "error",
              confirmButtonText: "Try again",
              confirmButtonColor: "#DD6B55"
          });
        }
        else
        {
           swal({
                title: "Success!",
                text: "Delete your period info successfully!!!",
                type: "success",
                confirmButtonText: "Cool"
              }, function(){ window.location.reload(true);
              });
        }
      });
    })

    document.getElementById('updateUser').addEventListener('click', () => {
        ipcRenderer.send('DirectToUpdateUser', uInfo);
    });
    document.getElementById('homepage').addEventListener('click', () => {
        ipcRenderer.send('DirectToHomePage', uInfo);
    });

    document.getElementById('periodInsertion').addEventListener('click', () => {
        ipcRenderer.send('DirectToPeriodInsertion', uInfo);
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

  function selectFunction() {
    var start = document.getElementById("all_start").value;
    database.find_endday(uInfo._id, ddmmyyToyymmdd(start), function(res, err){
      if(err === null){
        document.getElementById("end").disabled = false;		//enable ngày kết thúc
        document.getElementById("hoantat").disabled = false;//enable button hoàn tất
        document.getElementById("xoa").disabled = false;//enable button hoàn tất
        //in ra ngày kết thúc
        document.getElementById('end').value = yymmddToddmmyy(res);

        //in ra kỳ kinh kèo dài
        if(res!==""){
          var end = document.getElementById("end").value;
          var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
          var x = start.split("/");
          var y = end.split("/");
          var s = new Date(x[2], x[1] - 1, x[0]);
          var e = new Date(y[2], y[1] - 1, y[0]);
          var kykinh = Math.round((e.getTime() - s.getTime())/oneDay) + 1;
          document.getElementById("kykinh").innerHTML = kykinh;
        }
        else{
          document.getElementById("kykinh").innerHTML = "";
        }
        $("#end").datepicker( "option", "minDate", start);	//end>start
      }
      else{
        document.getElementById("kykinh").innerHTML = "";
        document.getElementById("end").value = "";
        document.getElementById("end").disabled = true;
        document.getElementById("hoantat").disabled = true;
        document.getElementById("xoa").disabled = true;

      }
    })
  }


ipcRenderer.on('DirectToPeriodInfoReply', (event, arg) => {
  uInfo = arg;
  document.getElementById('username').innerHTML = uInfo._id;
  //console.log(uInfo._id);
  database.getAllPeriod(uInfo._id, function(res, err){
    if (err === null)
    {
      var all_start = '<option value="None" >-- Select period --</option>';
      var periodIDs = docURI.route('periodIDs/:Username/:FirstDay');
      for (var i=0;i<res.length;i++)
      {

        var start = periodIDs(res[i]._id);
        all_start += '<option id ="option" value="' + yymmddToddmmyy(start.FirstDay) + '">' + yymmddToddmmyy(start.FirstDay) +'</option>';
      }
      document.getElementById('all_start').innerHTML = all_start;
    }
    else
    {
        console.log(err);
    }
  })

});
