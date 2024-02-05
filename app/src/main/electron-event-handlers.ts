import { Task, TaskGroup } from "./types";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { ScheduleRunner } from "./scheduleRunner";
import {
  ADD_TASK_EVENT,
  DELETE_TASK_EVENT,
  DELETE_TASK_GROUP_EVENT,
  ERROR_EVENT,
  GET_SCHEDULE_EVENT,
  OPEN_TASK_LOG_FILE_EVENT,
  SEND_SCHEDULE_EVENT,
  START_TASK_EVENT,
  STOP_TASK_EVENT,
  TASK_ADDED_EVENT,
  TASK_DELETED_EVENT,
  TASK_FAILED_EVENT,
  TASK_STARTED_EVENT,
  TASK_UPDATED_EVENT,
  TASK_WAITING_EVENT,
  UPDATE_TASK_EVENT,
} from "../event-names";
import { openLogFile } from "./logger";
import { ConfigController } from "./controllers/config.controller";

const scheduleRunner = new ScheduleRunner();
const configController = new ConfigController();

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

ipcMain.on(ADD_TASK_EVENT, async (event, data:{
  task:Task,
  taskGroup: TaskGroup
}) => {
  try {
    if (data.task.id) {
      scheduleRunner.updateTask(data.task);
    } else {
      scheduleRunner.createTask(data.task, data.taskGroup);
    }
  } catch (e) {
    console.log(e);
    mainWindow.webContents.send(ERROR_EVENT, e);
  }
});

ipcMain.on(START_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.queueTask(task);
});

ipcMain.on(STOP_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.stopTask(task);
});

ipcMain.on(UPDATE_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.updateTask(task);
});

ipcMain.on(DELETE_TASK_EVENT, async (event, task: Task) => {
  scheduleRunner.deleteTask(task);
});

ipcMain.on(DELETE_TASK_GROUP_EVENT, async(event, taskGroup:TaskGroup)=>{
  scheduleRunner.deleteTask(taskGroup)
})

ipcMain.on(OPEN_TASK_LOG_FILE_EVENT, (event, task: Task) => {
  openLogFile(task);
});

scheduleRunner.scheduleController.onChange((schedule) => {
  mainWindow.webContents.send(SEND_SCHEDULE_EVENT, schedule);
});
