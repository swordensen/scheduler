// start the redis server
import { resolve, normalize } from "path";

import { spawnSync, spawn, exec, execSync } from "child_process";
import { Queue, Worker, QueueScheduler } from "bullmq";
import { app } from "electron";
import IORedis from "ioredis";
import { Task } from "./types";
const resourcePath = app.isPackaged ? process.resourcesPath : resolve(__dirname, "../extraResources");
const memuraiPath = resolve(resourcePath, "./win/memurai.exe");
const memuraiCLIPath = resolve(resourcePath, "./win/memurai-cli.exe");
import "./defaults";
import { userDataFolder } from "./defaults";
import { existsSync, openSync } from "fs";
// change memurai working directory to user data folder;

const configFilePath = resolve(resourcePath, "./win/memurai.conf");
const logFilePath = resolve(userDataFolder, "memurai-log.txt");
if (!existsSync(logFilePath)) openSync(logFilePath, "w");
const workDirectoryPath = userDataFolder;
const PORT = "9001";

spawn(memuraiPath, [configFilePath, "--port", PORT, "--logfile", logFilePath, "--dir", workDirectoryPath]);

const connection = new IORedis(PORT);
connection.config("GET" as any, "dir").then((dir) => console.log(dir));
// if (_redisWorkingDirectory !== userDataFolder) {
//   try {
//     await connection.config("SET" as any, "dir", userDataFolder);
//   } catch (e) {
//     console.log(e);
//   }
//   await connection.config("REWRITE");
// }
// Reuse the ioredis instance
export const jobQueue = new Queue("myqueue", { connection });
export const queueScheduler = new QueueScheduler("myqueue", { connection });

const concurrency = 4;
const myWorker = new Worker(
  "myqueue",
  async (job) => {
    const task = job.data as Task;
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
  jobQueue.close();
  myWorker.close();
  queueScheduler.close();
});
