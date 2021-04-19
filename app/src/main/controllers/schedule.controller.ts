import { existsSync, readFileSync, watchFile, writeFileSync } from "fs";
import { scheduleFile } from "../defaults";
import { LOGGER } from "../logger";
import { Schedule, Task } from "../types";
import { sendAt } from "cron";
import { v4 as uuid } from "uuid";

/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
export class ScheduleController {
  /**
   * returns a readonly schedule. The values in this array should not be changed.
   */
  get schedule() {
    return this.readScheduleFile();
  }

  private set _schedule(schedule: Schedule) {
    this.writeScheduleFile(schedule);
  }

  private get _scheduleFileExists() {
    return existsSync(scheduleFile);
  }

  constructor() {
    LOGGER.info(`creating schedule file manager...`);
  }

  /**
   * creates the schedule file if it doesn't exist.
   * returns schedule
   */
  private readScheduleFile(): Readonly<Schedule> {
    LOGGER.info(`reading schedule file ${scheduleFile}...`);
    try {
      if (!this._scheduleFileExists) this.initScheduleFile();
      return JSON.parse(readFileSync(scheduleFile, "utf8"));
    } catch (e) {
      LOGGER.error(`unable to parse schedule file ${scheduleFile}`);
      throw e;
    }
  }

  /**
   * returns a schedule whenever the schedule file changes
   * @param cb
   */
  public onChange(cb: (schedule: Readonly<Schedule>) => void) {
    LOGGER.info(`registering schedule file listener...`);
    try {
      watchFile(scheduleFile, (curr, prev) => {
        cb(this.schedule);
      });
    } catch (e) {
      LOGGER.error("unable to establish schedule watch file listener");
    }
  }

  /**
   * adds a task to the schedule file.
   * Keep in mind we only want to read from the file once.
   * @param task
   */
  public addTask(task: Task): number {
    const currentSchedule = this.schedule;
    this._schedule = [
      ...currentSchedule,
      {
        ...task,
        id: uuid(),
        next: task.cron ? sendAt(task.cron).milliseconds() : Date.now() + task.interval,
      },
    ];
    return currentSchedule.length;
  }

  /**
   * deletes a task from the schedule file
   * also notifies any listeners, the index of the task that was deleted
   * @param index
   */
  public deleteTask(task: Task) {
    const currentSchedule = this.schedule;
    this._schedule = currentSchedule.reduce((accumulator, current) => {
      if (current.id !== task.id) accumulator.push(current);
      return accumulator;
    }, [] as Schedule);
  }

  public updateTask(task: Task) {
    this._schedule = this.schedule.map((_task, i) => {
      if (task.id === _task.id) {
        return {
          ..._task,
          ...task,
        };
      }
      return _task;
    });
  }

  /**
   * updates the last executed time.
   * and sets the next time the script will be ran
   * @param index
   * @param lastExecuted
   */
  public startTask(task: Task) {
    this._schedule = this.schedule.map((_task, i) => {
      if (task.id == _task.id) {
        return {
          ...task,
          status: "active",
          lastExecuted: Date.now(),
          next: task.cron ? sendAt(task.cron).milliseconds() : Date.now() + task.interval,
        };
      }
      return task;
    });
  }

  public endTask(task: Task) {
    this._schedule = this.schedule.map((_task, i) => {
      if (task.id === _task.id) {
        return {
          ...task,
          status: "waiting",
        };
      }
      return task;
    });
  }

  /**
   * writes the schedule file
   * @param scheduleFile
   */
  private writeScheduleFile(tasks: Schedule): Schedule {
    LOGGER.info(`writing to ${scheduleFile} schedule file ${JSON.stringify(tasks)}`);
    writeFileSync(scheduleFile, JSON.stringify(tasks));
    return tasks;
  }

  /**
   * empties schedule file
   */
  public clearSchedule() {
    LOGGER.info(`clearing schedule file`);
    this._schedule = [];
  }

  /**
   * inits the schedule file with an empty array
   * (same as clear schedule)
   */
  private initScheduleFile() {
    LOGGER.info(`initializing schedule file`);
    this._schedule = [];
  }
}
