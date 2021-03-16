require("update-electron-app")();
try {
  require("electron-reloader")(module);
} catch {}
import "./redis-setup";
import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import { Task } from "./types";
import { existsSync } from "fs";
import { resolve } from "path";
import open from "open";
import { MyJobQueue } from "./bull";

const shouldHide = process.argv[2];
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

let tray = null;
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  args: ["hide"],
});
app.on("ready", () => {
  const iconPath = resolve(__dirname, "assets/icon.png");
  tray = new Tray(iconPath);
  tray.setToolTip("scheduler");
  tray.on("click", (e) => {
    win.show();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "open",
      click: () => {
        win.show();
      },
    },
    {
      label: "quit",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      // contextIsolation: true,
      devTools: !app.isPackaged,
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    title: "scheduler",
    frame: false,
    show: shouldHide ? false : true,
  });
  win.on("minimize", (event: any) => {
    event.preventDefault();
    win.hide();
  });
  // app.getPath(MAIN_WINDOW_WEBPACK_ENTRY);
  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  ipcMain.on("get-jobs", async () => {
    const jobs = await MyJobQueue.getRepeatableJobs();

    win.webContents.send("schedule", jobs);
  });

  ipcMain.on("add-task", async (event, task: Task) => {
    await MyJobQueue.add(task.name, task, {
      repeat: {
        every: task.interval,
        cron: task.cron,
      },
    });
    const jobs = await MyJobQueue.getRepeatableJobs();
  });

  ipcMain.on("delete-task", async (event, key: string) => {
    await MyJobQueue.removeRepeatableByKey(key);
  });

  ipcMain.on("start-task", (event, index) => {});

  ipcMain.on("open-log", (event, index) => {});

  ipcMain.on("get-schedule", async (event) => {
    await MyJobQueue.waitUntilReady();
    const jobs = await MyJobQueue.getRepeatableJobs();

    win.webContents.send("schedule", jobs);
  });
});
