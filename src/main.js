const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

let mainWindow


app.on('ready', _=>{
	mainWindow = new BrowserWindow({
		height: 780,
		width: 1280,
		resizable: false,
	});

	console.log('hoho');

	mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file:',
    slashes: true
  }));

	mainWindow.on('closed', _=>{
		mainWindow = null;
	})
});
