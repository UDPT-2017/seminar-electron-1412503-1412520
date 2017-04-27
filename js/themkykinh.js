const database = require('../js/database');
const jquery = require('../js/jquery-1.9.1.js');
const jqueryui = require('../js/jquery-ui-1.10.1.min.js');


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


window.onload = function() {
  // Add the add button click event
  document.getElementById('hoantat').addEventListener('click', () => {

    // Retrieve the input fields
    //var username = document.getElementById('id của user bên html');
    var username = "ThaoLua";
    var x = $("#start").val();
    var y = $("#end").val();

    // var start = new Date(x[2], x[1] - 1, x[0]);
    // var end = new Date(y[2], y[1] - 1, y[0]);

    console.log(start);
    console.log(end);
    // Save the person in the database
    database.addPeriod(username, x, y);
    // Reset the input fields
    $("#end").val("");
    $("#start").val("")
    document.getElementById("kykinh").value = "";
  });
}
