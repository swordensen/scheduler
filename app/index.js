const { app, BrowserWindow } = require("electron");
require("electron-reload")(__dirname + "/assets");
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
    },
    frame: false,
  });
  // and load the index.html of the app.
  win.loadFile("index.html");
}
app.on("ready", createWindow);
