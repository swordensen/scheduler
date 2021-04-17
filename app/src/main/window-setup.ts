import { app, BrowserWindow, Menu, Tray } from "electron";
import { iconPath } from "./defaults";
import "./electron-event-handlers";
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
  console.log("setting up window");
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
  console.log("setting up tray");
  tray = new Tray(iconPath);
  tray.setToolTip("scheduler");
  tray.on("click", (e) => {
    mainWindow.show();
  });
  console.log("setting up context menu");
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

  console.log("disable minimize");
  mainWindow.on("minimize", (event: any) => {
    event.preventDefault();
    mainWindow.hide();
  });

  console.log("loading url localhost:4200");
  mainWindow.loadURL("http://localhost:4200");
}
