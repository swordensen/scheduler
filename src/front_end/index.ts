import { ScheduleFileManager } from "../scheduleFileManager";
import fs from "fs";
import { DEFAULT_CONFIG_PATH } from "../defaults";
import { Config } from "../types";
import { app, BrowserWindow } from "electron";
import path from "path";

const configFile = fs.readFileSync(DEFAULT_CONFIG_PATH, "utf8");
const htmlFile = path.resolve(process.cwd(), "index.html");
const config: Config = JSON.parse(configFile);

const scheduleFileManager = new ScheduleFileManager(config);
console.log(scheduleFileManager.readScheduleFile());

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  // and load the index.html of the app.
  win.loadFile(htmlFile);
}
app.on("ready", createWindow);
