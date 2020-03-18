const { app, BrowserWindow } = require("electron");

global.sharedObject = {
  thisUser: null,
  searchUser: null
}


app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.maximize();
    mainWindow.loadFile("views/login.html");

});

// force chromium to use the appropriate color profile instead
// of the one set by the OS
app.commandLine.appendSwitch("force-color-profile", "srgb");