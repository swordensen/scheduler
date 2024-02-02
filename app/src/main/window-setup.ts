import { app, BrowserWindow, Menu, Tray } from "electron";
import { iconPath, middleManPath } from "./defaults";
import "./electron-event-handlers";
import { resolve } from "path";
/**
 * THIS FILE HANDLES EVERYTHING THAT NEEDS TO BE HANDLED AS ELECTRON STARTS
 */
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: process.platform === "darwin",
  args: ["hide"],
});

const shouldHide = process.argv[2];

export let mainWindow: BrowserWindow;

export let tray: Tray;

export function setup() {
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      // contextIsolation: true,
      // devTools: true,
      devTools: !app.isPackaged,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    icon: iconPath,
    title: "scheduler",
    frame: false,
    show: shouldHide ? false : true,
  });

  mainWindow.webContents.openDevTools();
  tray = new Tray(iconPath);
  tray.setToolTip("scheduler");
  tray.on("click", (e) => {
    mainWindow.show();
  });
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "open",
      click: () => {
        mainWindow.show();
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

  mainWindow.on("minimize", (event: any) => {
    event.preventDefault();
    mainWindow.hide();
  });
  if (app.isPackaged) {
    mainWindow.loadFile(resolve(__dirname, "../renderer/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:4200");
  }
}
