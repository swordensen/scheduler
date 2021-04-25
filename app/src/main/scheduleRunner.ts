import { Task } from "./types";
import { exec, spawn } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";
import { sendAt } from "cron";
import { resolve, normalize } from "path";
import { openSync } from "original-fs";
import { logFolder } from "./defaults";

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly.
 *
 */
export class ScheduleRunner {
  public scheduleController = new ScheduleController();
  private INTERVAL_PERIOD = 15000; // 1 MINUTE
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
        if (this.timeToRun(task)) {
          this.startTask(task);
        }
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
    LOGGER.info(`attempting to run task ${task.name}`);
    try {
      const _task: Task = {
        ...task,
        status: "active",
        lastExecuted: Date.now(),
        next: task.cron ? sendAt(task.cron).milliseconds() : Date.now() + parseInt(task.interval),
      };
      this.scheduleController.updateTask(_task);
      console.log("trigerring task started listeners...");
      this.taskStartedListeners.forEach((cb) => {
        cb(_task);
      });

      const outFilePath = resolve(logFolder, `./commands/${task.name}.log`);
      const errFilePath = resolve(logFolder, `./commands/${task.name}-error.log`);
      const outFile = openSync(outFilePath, "a");
      const errFile = openSync(errFilePath, "a");
      const process = spawn(task.command, task.arguments, {
        detached: true,
        shell: true,
        stdio: [outFile, outFile, errFile],
      });
      taskLogger(task, process); //investigate potential memory leak
      process.on("exit", (code) => {
        if (code === 0) {
          const __task: Task = {
            ..._task,
            status: "waiting",
          };
          this.taskWaitingListeners.forEach((cb) => {
            cb(__task);
          });
          this.scheduleController.updateTask(__task);
        } else {
          const __task: Task = {
            ..._task,
            status: "failed",
          };
          this.taskFailedListeners.forEach((cb) => {
            cb(__task);
          });
          this.scheduleController.updateTask(__task);
        }
      });
      process.unref();
    } catch (e) {
      console.log(e);
      throw `could not start task ${e}`;
    }
  }

  /**
   * decides if it's time to run the command. Based on the interval provided
   * and the time it was last ran
   * @param schedule
   */
  private timeToRun(task: Task): boolean {
    if (task.next) {
      const currentTime = Date.now();
      if (currentTime > task.next) return true;
    }
    return false;
  }
}
