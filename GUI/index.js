const { app, BrowserWindow, ipcMain } = require("electron");
require("electron-reload")(__dirname + "/assets");
const psList = require("ps-list");
const { spawn, exec } = require("child_process");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: false,
  });
  // and load the index.html of the app.
  win.loadFile("index.html");

  isRunning = null;
  const interval = setInterval(async () => {
    try {
      const list = await psList();
      const scheduler = list.find((process) => process.name === "scheduler-win.exe");

      win.webContents.send("update-running-status", scheduler);
    } catch (e) {
      console.log("unable to retrieve process list");
      console.log(e);
    }
  }, 5000);

  ipcMain.on("start-scheduler", () => {
    if (!isRunning) {
      console.log("starting scheduler");
      const child = spawn("../bin/scheduler-win.exe", { detached: true, windowsHide: true, shell: false });
      child.unref();
    }
    isRunning = true;
  });
}
app.on("ready", createWindow);
