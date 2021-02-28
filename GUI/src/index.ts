import { app, BrowserWindow, ipcMain } from "electron";

import psList from "ps-list";
import { spawn } from "child_process";
import { ScheduleFileManager } from "../../fileManager/lib/scheduleFileManager";
import { openLogFile } from "../../fileManager/lib/helpers";
import { join, dirname } from "path";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const scheduleFileManager = new ScheduleFileManager();
const pathToRunner = join(__dirname, "extraResources", "runner.exe");
console.log(__dirname);

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    frame: false,
  });
  // app.getPath(MAIN_WINDOW_WEBPACK_ENTRY);
  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  win.webContents.once("dom-ready", () => {
    win.webContents.send("schedule", scheduleFileManager.schedule);
  });

  let isRunning: boolean | null = null;
  const interval = setInterval(async () => {
    try {
      const list = await psList();
      const scheduler = list.find((process) => process.name === "runner.exe");

      win.webContents.send("update-running-status", scheduler);
    } catch (e) {
      console.log("unable to retrieve process list");
      console.log(e);
    }
  }, 5000);

  ipcMain.on("start-scheduler", () => {
    if (!isRunning) {
      const child = spawn(pathToRunner, { detached: true, windowsHide: true, shell: false });
      child.unref();
    }
    isRunning = true;
  });

  ipcMain.on("add-task", (event, task) => {
    scheduleFileManager.addTask(task);
  });

  ipcMain.on("delete-task", (event, index) => {
    scheduleFileManager.deleteTask(index);
  });

  ipcMain.on("open-log", (event, task) => {
    openLogFile(task);
  });

  scheduleFileManager.onChange((schedule) => {
    win.webContents.send("schedule", schedule);
  });

  // Open the DevTools.
  win.webContents.openDevTools();
}
app.on("ready", createWindow);
