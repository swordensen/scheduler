import { existsSync, fstat, readFileSync, unlink, writeFile, writeFileSync } from "fs";
import { DEFAULT_CONFIG, DEFAULT_CONFIG_PATH } from "./defaults";
import { Config, Schedule, Task } from "./types";
import { exec, spawn } from "child_process";
import { ScheduleFileManager } from "./scheduleFileManager";
import LOGGER from "./logger";
import { createLogger, Logger } from "winston";
import { File } from "winston/lib/winston/transports";

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly
 */
export class ScheduleRunner {
  private configPath = DEFAULT_CONFIG_PATH;
  private config = this.getConfig();
  public scheduleFileManager = new ScheduleFileManager(this.config);
  private startListeners: Function[] = [];
  private INTERVAL_PERIOD = 15000; // 1 MINUTE
  private interval?: NodeJS.Timeout = this.mainInterval();

  get schedule(): Schedule {
    return this.scheduleFileManager.schedule;
  }

  public start() {
    LOGGER.info("starting main interval...");
    this.interval = this.mainInterval();
    LOGGER.info("calling start listeners");
    this.startListeners.forEach((listener) => listener());
  }

  public stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    } else {
      throw "interval is not defined. Cannot stop. Good Luck.";
    }
  }

  private mainInterval(): NodeJS.Timeout {
    return setInterval(() => {
      LOGGER.info("MAIN INTERVAL LOOP");
      this.schedule.forEach((task, index) => {
        LOGGER.info(`checking task ${task.name}`);
        if (this.timeToRun(task)) {
          LOGGER.info(`attempting to run task ${task.name}`);
          const process = exec(task.command);
          const logger = createLogger({
            level: "info",
            transports: [
              new File({ filename: `../logs/commands/${task.name}.log` }),
              new File({ filename: `../logs/commands/${task.name}-error.log`, level: "error" }),
            ],
          });
          logger.info(`attempting to execute ${task.command}`);
          process.stdout?.on("data", (data) => logger.info(data.toString()));
          process.stderr?.on("data", (data) => logger.error(data.toString()));
          process.on("exit", (code) => logger.info(`process exited with code ${code?.toString()}`));
          this.scheduleFileManager.updateLastExecutedTime(index, Date.now());
        }
        return task;
      });
      LOGGER.info("MAIN INTERVAL LOOP END");
    }, this.INTERVAL_PERIOD);
  }

  /**
   * decides if it's time to run the command. Based on the interval provided
   * and the time it was last ran
   * @param schedule
   */
  private timeToRun(task: Task): boolean {
    if (task.interval !== "startup") {
      const currentTime = Date.now();
      const scheduledTime = task.lastExecuted + task.interval;
      if (currentTime > scheduledTime) return true;
    }
    return false;
  }

  private getConfig(): Config {
    LOGGER.info("getting scheduler config");
    if (existsSync(this.configPath)) {
      LOGGER.info("config file exists!");
      const configStr = readFileSync(this.configPath, "utf8");
      try {
        return JSON.parse(configStr);
      } catch (e) {
        LOGGER.error(`unable to parse config file text: ${configStr}`);
      }
    }
    LOGGER.info("creating a new config file with default values");
    writeFile(this.configPath, JSON.stringify(DEFAULT_CONFIG), () => {
      /*done writing file */
    });
    return DEFAULT_CONFIG;
  }

  public deleteConfig(): Promise<void> {
    LOGGER.info(`deleting config file! ${this.configPath}`);
    return new Promise((resolve, reject) => {
      unlink(this.configPath, (err) => {
        if (err) {
          LOGGER.error(`unable to delete config file ${this.configPath}`);
        }
        resolve();
      });
    });
  }
}
