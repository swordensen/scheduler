import { Task } from "./types";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { ScheduleRunner } from "./scheduleRunner";
import {
  ADD_TASK_EVENT,
  DELETE_TASK_EVENT,
  GET_SCHEDULE_EVENT,
  SEND_SCHEDULE_EVENT,
  START_TASK_EVENT,
} from "../event-names";

const scheduleRunner = new ScheduleRunner();

console.log("initializing event handlers ");
/**
 * this only gets called on the initial page load. Ideally it should
 */
ipcMain.on(GET_SCHEDULE_EVENT, async () => {
  console.log(`getting schedule...`);
  const schedule = scheduleRunner.scheduleController.schedule;
  mainWindow.webContents.send(SEND_SCHEDULE_EVENT, schedule);
});

ipcMain.on(ADD_TASK_EVENT, async (event, task: Task) => {
  console.log(`adding task ${task.name}`);
  scheduleRunner.scheduleController.addTask(task);
});

ipcMain.on(START_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.startTask(task);
});

ipcMain.on(DELETE_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.scheduleController.deleteTask(task);
});

scheduleRunner.scheduleController.onChange((schedule) => {
  mainWindow.webContents.send(SEND_SCHEDULE_EVENT, schedule);
});
