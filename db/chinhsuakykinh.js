const database = require('../db/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');


var username = "ThaoLua"
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
    database.all_period(username);
    //Lưu thay đổi
    document.getElementById('hoantat').addEventListener('click', () => {
      var x = $("#all_start").val();
      var y = $("#end").val();
      database.updatePeriod(username, x, y);
    })

    //Xóa kỳ kinh
    document.getElementById('xoa').addEventListener('click', () => {
      var x = $("#all_start").val();
      console.log("đi vô xóa rồi nè hihi " + x);
      database.deletePeriod(username, x);
      document.getElementById("all_start").value = "";
      document.getElementById("end").value = "";
      document.getElementById("kykinh").value = "";
      alert("Xóa thành công!");
      window.location.reload(true);
    })
  }

  function selectFunction() {

    document.getElementById("end").disabled = false;		//enable ngày kết thúc
    document.getElementById("hoantat").disabled = false;//enable button hoàn tất
    document.getElementById("xoa").disabled = false;//enable button hoàn tất

    var start = document.getElementById("all_start").value;
    //var username = document.getElementById('id của user bên html');
    // var username = "ThaoLua"
    database.find_endday(username, start);

    $("#end").datepicker( "option", "minDate", start );	//end>start
  }
