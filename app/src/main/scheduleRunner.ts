import { Task, TaskGroup, UTrigger } from "./types";
import { spawn, spawnSync, ChildProcess } from "child_process";
import { ScheduleController } from "./controllers/schedule.controller";
import LOGGER, { taskLogger } from "./logger";
import { killProcess, spacesNotInQuotesRegex } from "./helpers";
import { normalize } from "path";
import Queue from "queue";
import { cpus } from "os";

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly.
 *
 */
export class ScheduleRunner {
  public scheduleController = new ScheduleController();
  private taskQueue = new Queue({
    concurrency: cpus().length,
    timeout: 1000,
    autostart: true,
  })
  private INTERVAL_PERIOD = 15000; // 15 seconds
  private interval?: NodeJS.Timeout = this.mainInterval();
  private taskStartedListeners: Array<(task: Task) => void> = [];
  private taskFailedListeners: Array<(task: Task) => void> = [];
  private taskWaitingListeners: Array<(task: Task) => void> = [];
  private taskAddedListeners: Array<(task: Task) => void> = [];
  private taskDeletedListeners: Array<(task: Task | TaskGroup) => void> = [];
  private taskUpdatedListeners: Array<(task: Task) => void> = [];
  private taskStoppedListeners: Array<(task: Task) => void> = [];

  private get schedule() {
    return this.scheduleController.schedule;
  }

  constructor() {
    this.runStartupTasks();
  }

  /**
   * run startup triggers at startup
   */
  private runStartupTasks() {
    function triggerTask(task:Task){
      const startupTrigger = task.triggers.find((trigger) => trigger.type === "startup");
      if (startupTrigger) {
        this.scheduleController.triggerTask(task, startupTrigger);
        this.startTask(task);
        // this.queueTask(task);
      }
    }

    this.scheduleController.forEachTask(task => {
      if(task.type === 'task'){
        triggerTask(task);
      }
      return task;
    })

  }

  public queueTask(task:Task){
    this._startTask(task);
    // this.taskQueue.push(()=>{
    //   return new Promise((resolve, reject)=>{
    //     const _process = this._startTask(task);
    //     _process.on('spawn', ()=>{
    //       resolve(true)
    //     });
    //     _process.on('error', ()=>{
    //       reject(false);
    //     })
    //   })
    // })
  }

  /**
   * this is our main interval loop
   */
  private mainInterval(): NodeJS.Timeout {
    const triggerTask = (task:Task) =>{
      LOGGER.info(`checking task ${task.name}`);
      task.triggers.forEach((trigger) => {
        if (this.checkTrigger(trigger)) {
          this.scheduleController.triggerTask(task, trigger);
          this._startTask(task)
          // this.queueTask(task);
        }
      });
    }

    return setInterval(() => {
      LOGGER.info("MAIN INTERVAL LOOP");
      this.scheduleController.forEachTask(task => {
        if(task.type === 'task'){
          triggerTask(task);
        }
        return task;
      })
      LOGGER.info("MAIN INTERVAL LOOP END");
    }, this.INTERVAL_PERIOD);
  }

  public onTaskStarted(cb: (task: Task) => void) {
    this.taskStartedListeners.push(cb);
  }

  public onTaskStopped(cb: (task: Task) => void) {
    this.taskStoppedListeners.push(cb);
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

  public createTask(task: Task, taskGroup:TaskGroup) {
    this.scheduleController.addTask(task, taskGroup);
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

  public deleteTask(task: Task | TaskGroup) {
    this.scheduleController.deleteTask(task);
    this.taskDeletedListeners.forEach((cb) => {
      cb(task);
    });
  }

  public startTask(task: Task) {
    this._startTask(task);
    // const process = this.queueTask(task);
  }

  /**
   * this kills a running task;
   * @param task
   */
  public stopTask(task: Task) {
    if(task.pids.length){
      for(const pid of task.pids){
        try{
          killProcess(pid);
        }catch(e){
          LOGGER.error(e);
        }
      }
    }

    this.scheduleController.stopTask({
      ...task,
      pids: [],
    });
  }

  /**
   * this is the main start task function
   * @param task
   */
  private _startTask(task: Task) {
    LOGGER.info(`attempting to run task ${task.name}`);
    try {
      task.lastExecuted = Date.now();
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


      try{
        const _process = spawn(command, commandArgs, task.spawnOptions)
        
        const loggerWriteStream = taskLogger(task, _process);
        _process.on('error', (err)=>{
          loggerWriteStream.write(err.name + '\n');
          loggerWriteStream.write(err.message + '\n');
          if(err.stack) loggerWriteStream.write(err.stack + '\n');
          const __task: Task = {
            ...task,
            status: "failed",
          };
          this.taskFailedListeners.forEach((cb) => {
            cb(__task);
          });
          this.scheduleController.updateTask(__task);
        })
  
        _process.on("exit", (code) => {
          loggerWriteStream.write(`Process Completed with code: ${code}`);
          loggerWriteStream.close();
          if (code === 0) {
            const __task: Task = {
              ...task,
              status: "waiting",
            };
            this.taskWaitingListeners.forEach((cb) => {
              cb(__task);
            });
            this.scheduleController.updateTask(__task);
          }else {
            const __task: Task = {
              ...task,
              status: "failed",
            };
            this.taskWaitingListeners.forEach((cb) => {
              cb(__task);
            });
            this.scheduleController.updateTask(__task);
          }
        });
        this.scheduleController.startTask({
          ...task,
          pids: [...task.pids, _process.pid],
        });
        // _process.unref();
        return _process;
      } catch (e) {
        console.log(e);
        throw `could not start task ${e}`;
      }
    }catch(e){
      const __task: Task = {
        ...task,
        status: "failed",
      };
      this.taskFailedListeners.forEach((cb) => {
        cb(__task);
      });
      this.scheduleController.updateTask(__task);
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
