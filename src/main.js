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
    pathname: path.join(__dirname, 'home.html'),
    protocol: 'file:',
    slashes: true
  }));


	mainWindow.on('closed', _=>{
		mainWindow = null;
	})
});

ipcMain.on('CreateUser', (event, arg) => {
	if (arg === 1)
		event.sender.send('CreateUserReply', 'got it');
	else
		event.sender.send('CreateUserReply', 'look like it failed @@');
});

ipcMain.on('SignIn', (event, arg) => {
	if (arg !== 0)
	{
		mainWindow.loadURL(url.format({
    	pathname: path.join(__dirname, 'home.html'),
    	protocol: 'file:',
    	slashes: true
  		}));
  		mainWindow.webContents.on('did-finish-load', () => {
   			mainWindow.webContents.send('DirectToHome', arg)
  		})
	}
	else
		event.sender.send('SignInReply', 'look like it failed @@');
});
