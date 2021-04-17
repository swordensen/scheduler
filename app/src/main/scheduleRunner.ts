import { Task } from "./types";
import { exec } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly.
 *
 */
export class ScheduleRunner {
  public scheduleController = new ScheduleController();
  private INTERVAL_PERIOD = 15000; // 1 MINUTE
  private interval?: NodeJS.Timeout = this.mainInterval();

  private get schedule() {
    return this.scheduleController.schedule;
  }

  /**
   * this is our main interval loop
   */
  private mainInterval(): NodeJS.Timeout {
    return setInterval(() => {
      LOGGER.info("MAIN INTERVAL LOOP");
      this.schedule.forEach((task, index) => {
        LOGGER.info(`checking task ${task.name}`);
        if (this.timeToRun(task)) {
          this.startTask(task, index);
        }
      });
      LOGGER.info("MAIN INTERVAL LOOP END");
    }, this.INTERVAL_PERIOD);
  }

  public startTaskNow(index: number) {
    const task = this.schedule[index];
    LOGGER.info(`attempting to run task ${task.name}`);
    const process = exec(task.command);
    taskLogger(task, process); //investigate potential memory leak
    process.on("exit", () => this.scheduleController.endTask(index));
    this.scheduleController.startTask(index);
  }

  private startTask(task: Task, index: number) {
    LOGGER.info(`attempting to run task ${task.name}`);
    const process = exec(task.command);
    taskLogger(task, process); //investigate potential memory leak
    process.on("exit", () => this.scheduleController.endTask(index));
    this.scheduleController.startTask(index);
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
}
