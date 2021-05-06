import { Task, UTrigger } from "./types";
import { exec, spawn } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";
import { sendAt } from "cron";
import { resolve, normalize } from "path";
import { existsSync, openSync } from "original-fs";
import { logFolder, taskLogFolder } from "./defaults";
import { createFolderIfNotExist } from "./helpers";

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly.
 *
 */
export class ScheduleRunner {
  public scheduleController = new ScheduleController();
  private INTERVAL_PERIOD = 15000; // 15 seconds
  private interval?: NodeJS.Timeout = this.mainInterval();
  private taskStartedListeners: Array<(task: Task) => void> = [];
  private taskFailedListeners: Array<(task: Task) => void> = [];
  private taskWaitingListeners: Array<(task: Task) => void> = [];
  private taskAddedListeners: Array<(task: Task) => void> = [];
  private taskDeletedListeners: Array<(task: Task) => void> = [];
  private taskUpdatedListeners: Array<(task: Task) => void> = [];

  private get schedule() {
    return this.scheduleController.schedule;
  }

  constructor() {
    console.log(`schedule runner initialized`);
  }

  /**
   * this is our main interval loop
   */
  private mainInterval(): NodeJS.Timeout {
    return setInterval(() => {
      LOGGER.info("MAIN INTERVAL LOOP");
      this.schedule.forEach((task) => {
        LOGGER.info(`checking task ${task.name}`);
        task.triggers.forEach((trigger) => {
          if (this.checkTrigger(trigger)) {
            this.scheduleController.triggerTask(task, trigger);
            this._startTask(task);
          }
        });
      });
      LOGGER.info("MAIN INTERVAL LOOP END");
    }, this.INTERVAL_PERIOD);
  }

  public onTaskStarted(cb: (task: Task) => void) {
    this.taskStartedListeners.push(cb);
  }

  public onTaskFailed(cb: (task: Task) => void) {
    this.taskFailedListeners.push(cb);
  }

  public onTaskWaiting(cb: (task: Task) => void) {
    this.taskWaitingListeners.push(cb);
  }

  public onTaskAdded(cb: (task: Task) => void) {
    this.taskAddedListeners.push(cb);
  }

  public onTaskDeleted(cb: (task: Task) => void) {
    this.taskDeletedListeners.push(cb);
  }

  public onTaskUpdated(cb: (task: Task) => void) {
    this.taskUpdatedListeners.push(cb);
  }

  public createTask(task: Task) {
    this.scheduleController.addTask(task);
    this.taskAddedListeners.forEach((cb) => {
      cb(task);
    });
  }

  public updateTask(task: Task) {
    this.scheduleController.updateTask(task);
    this.taskUpdatedListeners.forEach((cb) => {
      cb(task);
    });
  }

  public deleteTask(task: Task) {
    this.scheduleController.deleteTask(task);
    this.taskDeletedListeners.forEach((cb) => {
      cb(task);
    });
  }

  public startTask(task: Task) {
    const _task = this.scheduleController.startTask(task);
    this._startTask(_task);
  }

  /**
   * this is the main start task function
   * @param task
   */
  private _startTask(task: Task) {
    LOGGER.info(`attempting to run task ${task.name}`);
    try {
      this.taskStartedListeners.forEach((cb) => {
        cb(task);
      });
      const _process = spawn(task.command, task.arguments, {
        // detached: true,
        shell: true,
      });
      _process.stdout.pipe(process.stdout);
      console.log("creating task logger");
      taskLogger(task, _process); //investigate potential memory leak

      _process.on("exit", (code) => {
        if (code === 0) {
          const __task: Task = {
            ...task,
            status: "waiting",
          };
          this.taskWaitingListeners.forEach((cb) => {
            cb(__task);
          });
          this.scheduleController.updateTask(__task);
        } else {
          const __task: Task = {
            ...task,
            status: "failed",
          };
          this.taskFailedListeners.forEach((cb) => {
            cb(__task);
          });
          this.scheduleController.updateTask(__task);
        }
      });
      // process.unref();
    } catch (e) {
      console.log(e);
      throw `could not start task ${e}`;
    }
  }

  /**
   *
   * @param task
   * @returns
   */
  private checkTrigger(trigger: UTrigger): boolean {
    switch (trigger.type) {
      case "CRON":
      case "interval":
        const curTime = Date.now();
        const next = trigger.next;
        console.log(curTime, next);
        return curTime > next ? true : false;
      case "startup":
        return false;
    }
    return false;
  }
}
