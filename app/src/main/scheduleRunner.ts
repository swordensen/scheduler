import { Task } from "./types";
import { exec } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";
import { sendAt } from "cron";

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

  public startTask(task: Task) {
    LOGGER.info(`attempting to run task ${task.name}`);
    this.scheduleController.updateTask({
      ...task,
      status: "active",
      lastExecuted: Date.now(),
      next: task.cron ? sendAt(task.cron).milliseconds() : Date.now() + task.interval,
    });
    const process = exec(task.command);
    taskLogger(task, process); //investigate potential memory leak
    process.on("exit", (code) => {
      if (code === 0) {
        this.scheduleController.updateTask({
          ...task,
          status: "waiting",
        });
      } else {
        this.scheduleController.updateTask({
          ...task,
          status: "failed",
        });
      }
    });
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
