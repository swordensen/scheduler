// start the redis server
import { resolve } from "path";
import { spawn, exec } from "child_process";
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
export const queueScheduler = new QueueScheduler("myqueue", { connection });

const concurrency = 4;
export const myWorker = new Worker(
  "myqueue",
  async (job) => {
    console.log("attempting to execute job", job.name);
    const task = job.data as Task;
    console.log(task.command);
    const _process = exec(task.command);
    _process.on("error", (err) => console.log(err));
    _process.stdout.pipe(process.stdout);
    _process.stderr.pipe(process.stderr);
  },
  { connection, concurrency }
);
myWorker.on("completed", (job: Task, returnvalue: any) => {
  // Do something with the return value.
  console.log("completed", job.name);
});

myWorker.on("progress", (job: Task, progress: number | object) => {
  console.log("progress on ", job.name);
});
process.on("exit", () => {
  JobQueue.close();
  myWorker.close();
  queueScheduler.close();
});
