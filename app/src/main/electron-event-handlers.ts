import { Task } from "./types";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { ScheduleRunner } from "./scheduleRunner";
import {
  ADD_TASK_EVENT,
  DELETE_TASK_EVENT,
  ERROR_EVENT,
  GET_SCHEDULE_EVENT,
  OPEN_TASK_LOG_FILE_EVENT,
  SEND_SCHEDULE_EVENT,
  START_TASK_EVENT,
  TASK_ADDED_EVENT,
  TASK_DELETED_EVENT,
  TASK_FAILED_EVENT,
  TASK_STARTED_EVENT,
  TASK_UPDATED_EVENT,
  TASK_WAITING_EVENT,
  UPDATE_TASK_EVENT,
} from "../event-names";
import { openLogFile } from "./logger";

const scheduleRunner = new ScheduleRunner();

scheduleRunner.onTaskStarted((task) => {
  mainWindow.webContents.send(TASK_STARTED_EVENT, task);
});

scheduleRunner.onTaskFailed((task) => {
  mainWindow.webContents.send(TASK_FAILED_EVENT, task);
});

scheduleRunner.onTaskWaiting((task) => {
  mainWindow.webContents.send(TASK_WAITING_EVENT, task);
});

scheduleRunner.onTaskDeleted((task) => {
  mainWindow.webContents.send(TASK_DELETED_EVENT, task);
});

scheduleRunner.onTaskUpdated((task) => {
  mainWindow.webContents.send(TASK_UPDATED_EVENT, task);
});

scheduleRunner.onTaskAdded((task) => {
  mainWindow.webContents.send(TASK_ADDED_EVENT, task);
});

/**
 * this only gets called on the initial page load. Ideally it should
 */
ipcMain.on(GET_SCHEDULE_EVENT, async () => {
  const schedule = scheduleRunner.scheduleController.schedule;
  mainWindow.webContents.send(SEND_SCHEDULE_EVENT, schedule);
});

ipcMain.on(ADD_TASK_EVENT, async (event, task: Task) => {
  try {
    if (task.id) {
      scheduleRunner.updateTask(task);
    } else {
      scheduleRunner.createTask(task);
    }
  } catch (e) {
    console.log(e);
    mainWindow.webContents.send(ERROR_EVENT, e);
  }
});

ipcMain.on(START_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.startTask(task);
});

ipcMain.on(UPDATE_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.updateTask(task);
});

ipcMain.on(DELETE_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.deleteTask(task);
});

ipcMain.on(OPEN_TASK_LOG_FILE_EVENT, (event, task: Task) => {
  openLogFile(task);
});

scheduleRunner.scheduleController.onChange((schedule) => {
  mainWindow.webContents.send(SEND_SCHEDULE_EVENT, schedule);
});
