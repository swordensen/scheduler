import { app, BrowserWindow, Menu, Tray } from "electron";
import { iconPath } from "./defaults";
import "./event-handlers";

declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
  args: ["hide"],
});

const shouldHide = process.argv[2];

export const mainWindow = new BrowserWindow({
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

const tray = new Tray(iconPath);
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

mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
