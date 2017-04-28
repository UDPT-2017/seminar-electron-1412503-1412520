const database = require('../db/database');
const {ipcRenderer} = require('electron');





  //đăng ký
  document.getElementById('lgin').addEventListener('click', () => {

    // Retrieve the input fields
    var username = document.getElementById('name').value;
    var password = document.getElementById('pass').value;
    var password2 = document.getElementById('RePassword').value;
    var lastPeriod = document.getElementById('PD').value;
    var mentsCycle = document.getElementById('MC').value;
    var avgPeriod = document.getElementById('AP').value;

    console.log(lastPeriod.getDate());
    console.log(lastPeriod.getMonth());
    console.log(lastPeriod.getFullYear());


    // Save the person in the database
    database.addUser(username, password, lastPeriod, mentsCycle, avgPeriod, function(err){
    	if (err !== null)
    	{
            document.getElementById('success').classList.remove('show');
            document.getElementById('success').classList.add('hide');
            document.getElementById('fail').classList.remove('hide');
            document.getElementById('fail').classList.add('show');
            console.log(err);
    	}
    	else
    	{
            document.getElementById('fail').classList.remove('show');
            document.getElementById('fail').classList.add('hide');
            document.getElementById('success').classList.remove('hide');
            document.getElementById('success').classList.add('show');

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

document.getElementById('name').addEventListener('keyup', function() {
     if (this.value.length > 1) {
        
     }
});

document.getElementById('RePassword').addEventListener('keyup', function() {
     if (this.value.length > 1) {
        
     }
});

document.getElementById('MC').addEventListener('keyup', function() {
     if ((this.value < 1) || (this.value > 10)) {
        console.log('sai');
     }
});

document.getElementById('AP').addEventListener('keyup', function() {
     if ((this.value < 1) || (this.value > 10)) {
        
     }
});