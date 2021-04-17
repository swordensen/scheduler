import { app, BrowserWindow, Menu, Tray } from "electron";
import { iconPath } from "./defaults";
import "./electron-event-handlers";
import { resolve } from "path";
/**
 * THIS FILE HANDLES EVERYTHING THAT NEEDS TO BE HANDLED AS ELECTRON STARTS
 */
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
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

      devTools: !app.isPackaged,
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    title: "scheduler",
    frame: false,
    show: shouldHide ? false : true,
  });
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
  console.log(resolve(__dirname, "../renderer/index.html"));
  if (app.isPackaged) {
    mainWindow.loadFile(resolve(__dirname, "../renderer/index.html"));
  } else {
    mainWindow.loadURL("http://localhost:4200");
  }
}
