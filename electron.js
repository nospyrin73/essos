const { app, BrowserWindow } = require('electron');

app.whenReady().then(() => {
    //BrowserWindow.addDevToolsExtension('/home/nospyrin/.config/vivaldi/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/4.5.0_0');
    let mainWindow = new BrowserWindow({
        minHeight: 720,
        minWidth: 940,
        webPreferences: {
            nodeIntegration: true
        }
    });

    // mainWindow.setMenu(null);
    mainWindow.maximize();
    mainWindow.loadFile('public/index.html');
});

// force chromium to use the appropriate color profile instead
// of the one set by the OS
app.commandLine.appendSwitch('force-color-profile', 'srgb');
