const database = require('../db/database');
const {ipcRenderer} = require('electron');





  //đăng ký
  document.getElementById('lgin').addEventListener('click', () => {

    // Retrieve the input fields
    var username = document.getElementById('name').value;
    var password = document.getElementById('pass').value;
    var lastPeriod = document.getElementById('PD').value;
    var mentsCycle = document.getElementById('MC').value;
    var avgPeriod = document.getElementById('AP').value;

    // Save the person in the database
    database.addUser(username, password, lastPeriod, mentsCycle, avgPeriod, function(err){
    	if (err !== null)
    	{
    		ipcRenderer.send('CreateUser', 0);
    	}
    	else
    	{
    		console.log(err);
    		ipcRenderer.send('CreateUser', 1);
    	}
    });

    
  });

  	//đăng nhập
    document.getElementById('sin').addEventListener('click', () => {

    var res = undefined;

    var username = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;
    
    database.getUser(username, password, function(doc){
    	if (doc.Password.localeCompare(password) !== 0)
    	{
    		ipcRenderer.send('SignIn', 0);
    	}
    	else
    	{
    		ipcRenderer.send('SignIn', doc);
    	}
    });

	});


   	ipcRenderer.on('CreateUserReply', (event, arg)=>{
   		console.log(arg);
   	});

    // Repopulate the table
