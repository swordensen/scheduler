import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";

import psList from "ps-list";
import { spawn } from "child_process";
import { ScheduleFileManager } from "../../fileManager/lib/scheduleFileManager";
import { join, dirname } from "path";
import { Task } from "../../fileManager/lib/types";
import { existsSync } from "fs";
import { resolve } from "path";
import { logFolder } from "../../fileManager/lib/defaults";
import open from "open";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const scheduleFileManager = new ScheduleFileManager();
const pathToRunner = join(__dirname, "extraResources", "runner.exe");
let tray = null;
app.on("ready", () => {
  const iconPath = resolve(__dirname, "assets/icon.png");
  console.log(iconPath);
  tray = new Tray(iconPath);
  tray.setToolTip("scheduler");
  const contextMenu = Menu.buildFromTemplate([{ label: "quit", type: "radio" }]);
  tray.setContextMenu(contextMenu);
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    title: "scheduler",
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

  ipcMain.on("open-log", (event, index) => {
    const task = scheduleFileManager.schedule[index];
    openLogFile(task);
  });

  ipcMain.on("get-schedule", (event) => {
    win.webContents.send("schedule", scheduleFileManager.schedule);
  });

  scheduleFileManager.onChange((schedule) => {
    win.webContents.send("schedule", schedule);
  });

  // Open the DevTools.
  win.webContents.openDevTools();
});

/**
 * this function opens up the log file for viewing
 */
export function openLogFile(task: Task) {
  const path = resolve(logFolder, `./commands/${task.name}.log`);
  if (existsSync(path)) open(path);
}
