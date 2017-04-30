const database = require('../db/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');
const {ipcRenderer} = require('electron');
var uInfo = undefined;
var docURI = require('docuri');


yymmddToddmmyy = function(date){
  var x = date.split("-");
  return (x[2] + '/' + x[1]  + '/' + x[0]);
};
ddmmyyToyymmdd = function(date){
  var x = date.split("/");
  return (x[2] + '-' + x[1]  + '-' + x[0]);
};

  //tính chu kỳ kinh kéo dài
  function myFunction() {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var x = $("#all_start").val().split("/");
    var y = $("#end").val().split("/");

    var start = new Date(x[2], x[1] - 1, x[0]);
    var end = new Date(y[2], y[1] - 1, y[0]);
    var kykinh = Math.round((end.getTime() - start.getTime())/oneDay) + 1;
    document.getElementById("kykinh").innerHTML = kykinh;
  }

window.onload = function() {

     //Lưu thay đổi
    document.getElementById('hoantat').addEventListener('click', () => {
      var x = $("#all_start").val();
      var y = $("#end").val();
      database.updatePeriod(uInfo._id, x, y);
    })

    //Xóa kỳ kinh
    document.getElementById('xoa').addEventListener('click', () => {
      var x = $("#all_start").val();
      console.log("đi vô xóa rồi nè hihi " + x);
      database.deletePeriod(uInfo._id, x);
      document.getElementById("all_start").value = "";
      document.getElementById("end").value = "";
      document.getElementById("kykinh").value = "";
      alert("Xóa thành công!");
      window.location.reload(true);
    })

    document.getElementById('homepage').addEventListener('click', () => {
        ipcRenderer.send('DirectToHomePage', uInfo);
    });

    document.getElementById('periodInsertion').addEventListener('click', () => {
        ipcRenderer.send('DirectToPeriodInsertion', uInfo);
    });
  }

  function selectFunction() {

    document.getElementById("end").disabled = false;		//enable ngày kết thúc
    document.getElementById("hoantat").disabled = false;//enable button hoàn tất
    document.getElementById("xoa").disabled = false;//enable button hoàn tất

    var start = document.getElementById("all_start").value;
    //var username = document.getElementById('id của user bên html');
    // var username = "ThaoLua"
    database.find_endday(uInfo._id, start);

    $("#end").datepicker( "option", "minDate", start );	//end>start
  }


ipcRenderer.on('DirectToPeriodInfoReply', (event, arg) => {
  console.log(arg);
  uInfo = arg;
  document.getElementById('username').innerHTML = uInfo._id;
  console.log(uInfo._id);
  database.getAllPeriod(uInfo._id, function(res, err){
    if (err === null)
    {
      var all_start = '<option value="None" >-- Chọn kỳ kinh --</option>';
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

