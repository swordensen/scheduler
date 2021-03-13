// start the redis server
import { resolve } from "path";
import { spawn } from "child_process";
import { Queue, Worker, QueueScheduler } from "bullmq";
import { app } from "electron";
import IORedis from "ioredis";
import { Task } from "./types";
const resourcePath = app.isPackaged ? process.resourcesPath : resolve(__dirname, "../extraResources");
console.log(resourcePath, app.isPackaged);
const memuraiPath = resolve(resourcePath, "./win/memurai.exe");
const configFilePath = resolve(resourcePath, "./win/memurai.conf");
const logFilePath = resolve(resourcePath, "./win/memurai-log.txt");
console.log(resourcePath, memuraiPath);
const PORT = "9001";
spawn(memuraiPath, [configFilePath, "--port", PORT, "--logfile", logFilePath]);

const connection = new IORedis(PORT);

// Reuse the ioredis instance
export const JobQueue = new Queue("myqueue", { connection });
export const queueScheduler = new QueueScheduler("test");

const concurrency = 4;
export const myWorker = new Worker(
  "myworker",
  async (job) => {
    const task = job.data as Task;
    spawn(task.command);
  },
  { connection, concurrency }
);

process.on("exit", () => {
  JobQueue.close();
  myWorker.close();
  queueScheduler.close();
});
