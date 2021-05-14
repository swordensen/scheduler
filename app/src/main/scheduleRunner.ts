import { Task, UTrigger } from "./types";
import { spawn, spawnSync } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";
import { spacesNotInQuotesRegex } from "./helpers";
import { normalize } from "path";
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

  constructor() {}

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
      const parts = task.command.split(spacesNotInQuotesRegex).reduce((a, c) => {
        if (c) a.push(c);
        return a;
      }, [] as string[]);

      const command = normalize(parts.shift());
      const commandArgs = [...parts, ...task.arguments].reduce((a, c) => {
        c.replace(spacesNotInQuotesRegex, "");
        if (c) a.push(normalize(c));
        return a;
      }, []);

      const spawnOptions = {
        shell: true,
      };
      const _process = commandArgs.length ? spawn(command, commandArgs, spawnOptions) : spawn(command, spawnOptions);

      const logger = taskLogger(task, _process);

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
      // _process.unref();
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
        return curTime > next ? true : false;
      case "startup":
        return false;
    }
    return false;
  }
}
