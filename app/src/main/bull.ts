import { Processor, Queue, QueueEvents, QueueScheduler, Worker } from "bullmq";
import { queueName, redisPort } from "./defaults";
import { JobData } from "./types";
import Redis from "ioredis";
import { cpus } from "os";
import { exec, execSync, spawn } from "child_process";
import { mainWindow } from "./window-setup";

/**
 * we could work with one worker but, that wouldn't be fun
 */
const concurrency = cpus.length;
const cores = cpus.length;

// establish connection with redis server
export const connection = new Redis(redisPort);

// create jobQueue
export const MyJobQueue = new Queue(queueName, { connection });

// create queue schedule (required for repeatable jobs)
export const MyQueueScheduler = new QueueScheduler(queueName, { connection });
export const MyQueueEvents = new QueueEvents(queueName, { connection });
// create worker
export const MyWorker = new Worker(
  queueName,
  async (job) => {
    console.log(`starting job ${job.name} active`);
    mainWindow.webContents.send("update-job-status", { name: job.name, status: "active" });
    const data = job.data as JobData;
    const process = exec(data.task);
    process.on("exit", (code) => {
      console.log(`process exited with code ${code}`);
      if (code) {
        mainWindow.webContents.send("update-job-status", { name: job.name, status: "failed" });
      } else {
        mainWindow.webContents.send("update-job-status", { name: job.name, status: "" });
      }
    });
    return "free lock";
  },
  { connection }
);

// clean exit
process.on("exit", () => {
  MyJobQueue.close();
  MyQueueScheduler.close();
});
