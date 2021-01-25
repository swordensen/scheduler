import { existsSync, readFile, readFileSync, unlink, watchFile, writeFile, writeFileSync } from "fs";
import { DEFAULT_CONFIG, DEFAULT_SCHEDULE_FILE } from "./defaults";
import LOGGER from "./logger";
import { Config, Schedule, Task } from "./types";

/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
export class ScheduleFileManager {
  config: Config;
  schedule: Schedule;
  constructor(config?: Config) {
    LOGGER.info("creating schedule file manager...");
    this.config = config || DEFAULT_CONFIG;
    this.initScheduleFile();
    this.schedule = this.readScheduleFile();
  }

  /**
   * reads the schedule file
   */
  private readScheduleFile(): Schedule {
    LOGGER.info(`reading schedule file ${this.config.scheduleFilePath}...`);
    try {
      return JSON.parse(readFileSync(this.config.scheduleFilePath, "utf8"));
    } catch (e) {
      LOGGER.error(`unable to parse schedule file ${this.config.scheduleFilePath}`);
      throw e;
    }
  }

  /**
   * returns a schedule whenever the schedule file changes
   * @param cb
   */
  public onChange(cb: (schedule: Schedule) => void) {
    try {
      watchFile(this.config.scheduleFilePath, (curr, prev) => {
        const newSchedule = this.readScheduleFile();
        this.schedule = newSchedule;
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
  public addTask(task: Task) {
    const newSchedule = [
      ...this.schedule,
      {
        ...task,
        lastExecuted: 0,
      },
    ];
    this.writeScheduleFile(newSchedule);
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
  private writeScheduleFile(scheduleFile: Schedule): Schedule {
    LOGGER.info(`writing to ${JSON.stringify(scheduleFile)} schedule file ${this.config.scheduleFilePath}`);
    writeFileSync(this.config.scheduleFilePath, JSON.stringify(scheduleFile), "utf8");
    return scheduleFile;
  }
  /**
   * deletes schedule file
   */
  public deleteScheduleFile(): Promise<void> {
    LOGGER.info(`deleting schedule file ${this.config.scheduleFilePath}`);
    return new Promise((resolve, reject) => {
      unlink(this.config.scheduleFilePath, (err) => {
        if (err) {
          LOGGER.error(`unable to delete ${this.config.scheduleFilePath}`);
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
    if (!existsSync(this.config.scheduleFilePath)) {
      LOGGER.info(`schedule file does not exist. Creating one with default values.`);
      writeFileSync(this.config.scheduleFilePath, "[]", "utf8");
    }
  }
}
