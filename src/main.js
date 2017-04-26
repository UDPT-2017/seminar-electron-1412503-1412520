const electron = require('electron');
const {ipcMain} = require('electron');
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

	mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'logIn.html'),
    protocol: 'file:',
    slashes: true
  }));

	ipcMain.on('CreateUser', (event, arg) => {
	if (arg === 1)
		event.sender.send('CreateUserReply', 'got it');
	else
		event.sender.send('CreateUserReply', 'looks like it failed @@');
	});

	ipcMain.on('SignIn', (event, arg) => {
	if (arg !== 0)
	{
		mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file:',
    slashes: true
  }));
	}
	else
		event.sender.send('CreateUserReply', 'looks like it failed @@');
	});

	mainWindow.on('closed', _=>{
		mainWindow = null;
	})
});



