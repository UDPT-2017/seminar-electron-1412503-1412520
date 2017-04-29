const database = require('../db/database');
const {ipcRenderer} = require('electron');


ipcRenderer.on('DirectToHome', (event, arg) => {
	console.log(arg);
	document.getElementById('username').innerHTML = arg._id;
})
