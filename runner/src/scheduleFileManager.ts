import { existsSync, readFileSync, unlink, watchFile, writeFileSync } from "fs";
import { scheduleFile } from "./defaults";
import LOGGER from "./logger";
import { Config, Schedule, Task } from "./types";
/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
export class ScheduleFileManager {
  get schedule() {
    return this.readScheduleFile();
  }
  constructor() {
    LOGGER.info("creating schedule file manager...");
    this.initScheduleFile();
  }

  /**
   * reads the schedule file
   */
  private readScheduleFile(): Schedule {
    LOGGER.info(`reading schedule file ${scheduleFile}...`);
    try {
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
  public onChange(cb: (schedule: Schedule) => void) {
    try {
      watchFile(scheduleFile, (curr, prev) => {
        const newSchedule = this.readScheduleFile();
        cb(newSchedule);
      });
    } catch (e) {
      LOGGER.error("unable to establish schedule watch file listener");
    }
  }

  /**
   * adds a task to the schedule file
   * @param task
   */
  public addTask(task: Task): number {
    const newSchedule = [
      ...this.schedule,
      {
        ...task,
        lastExecuted: 0,
      },
    ];
    this.writeScheduleFile(newSchedule);

    return this.schedule.length - 1;
  }

  /**
   * deletes a task from the schedule file
   * @param index
   */
  public deleteTask(index: number) {
    const newSchedule = [...this.schedule.slice(0, index), ...this.schedule.slice(index + 1)];
    this.writeScheduleFile(newSchedule);
  }

  public updateLastExecutedTime(index: number, lastExecuted: number) {
    const newSchedule = this.schedule.map((task, i) => {
      if (i === index) {
        return {
          ...task,
          lastExecuted,
        };
      }
      return task;
    });
    this.writeScheduleFile(newSchedule);
  }

  /**
   * writes the schedule file
   * @param scheduleFile
   */
  private writeScheduleFile(tasks: Schedule): Schedule {
    LOGGER.info(`writing to ${JSON.stringify(scheduleFile)} schedule file ${scheduleFile}`);
    writeFileSync(scheduleFile, JSON.stringify(scheduleFile));
    return tasks;
  }
  /**
   * deletes schedule file
   */
  public deleteScheduleFile(): Promise<void> {
    LOGGER.info(`deleting schedule file ${scheduleFile}`);
    return new Promise((resolve, reject) => {
      unlink(scheduleFile, (err) => {
        if (err) {
          LOGGER.error(`unable to delete ${scheduleFile}`);
          reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * checks to see if a schedule file exists
   * otherwise creates one with default config
   */
  private initScheduleFile() {
    LOGGER.info(`initializing schedule file`);
    if (!existsSync(scheduleFile)) {
      LOGGER.info(`schedule file does not exist. Creating one with default values.`);
      writeFileSync(scheduleFile, "[]", "utf8");
    }
  }
}
