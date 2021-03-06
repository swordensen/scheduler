import { existsSync, readFileSync, watchFile, writeFileSync } from "fs";
import { scheduleFile } from "./defaults";
import { LOGGER } from "./logger";
import { Schedule, Task } from "./types";
/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
export class ScheduleFileManager {
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
        lastExecuted: 0,
      },
    ];
    return currentSchedule.length;
  }

  /**
   * deletes a task from the schedule file
   * also notifies any listeners, the index of the task that was deleted
   * @param index
   */
  public deleteTask(index: number) {
    const currentSchedule = this.schedule;
    this._schedule = [...currentSchedule.slice(0, index), ...currentSchedule.slice(index + 1)];
  }

  public updateTask(index: number, updatedTask: Partial<Task>) {
    this._schedule = this.schedule.map((task, i) => {
      if (index == i) {
        return {
          ...task,
          ...updatedTask,
        };
      }
      return task;
    });
  }

  /**
   * updates the last executed time.
   * @param index
   * @param lastExecuted
   */
  public startTask(index: number) {
    this._schedule = this.schedule.map((task, i) => {
      if (index == i) {
        return {
          ...task,
          running: true,
          lastExecuted: Date.now(),
        };
      }
      return task;
    });
  }

  public endTask(index: number) {
    this._schedule = this.schedule.map((task, i) => {
      if (index == i) {
        return {
          ...task,
          running: false,
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
