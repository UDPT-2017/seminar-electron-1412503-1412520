const database = require('../js/database');

window.onload = function() {

  // Populate the table
  //populateTable();

  // Add the add button click event
  document.getElementById('hoantat').addEventListener('click', () => {

    // Retrieve the input fields
    //var username = document.getElementById('start');
    var username = "ThaoLua";
    var start = $("#start").val();
    console.log(start);
    var end = $("#end").val();
    console.log(end);
    // Save the person in the database
    database.addPeriod(username, start, end);

    
    // Reset the input fields
    // $("#end").val("");
    // $("#start").val("")

    // Repopulate the table
    //populateTable();
  });
}
