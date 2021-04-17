import { Task } from "./types";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { v4 as uuid } from "uuid";

/**
 * this only gets called on the initial page load. Ideally it should
 */
ipcMain.on("get-jobs", async () => {
  // mainWindow.webContents.send("schedule", jobs);
});

ipcMain.on("add-job", async (event, task: Task) => {
  mainWindow.webContents.send("add-job", task);
});

ipcMain.on("start-job", async (event, jobData: Task) => {});

ipcMain.on("remove-job", async (event, jobData: Task) => {
  mainWindow.webContents.send("remove-job", jobData);
});
