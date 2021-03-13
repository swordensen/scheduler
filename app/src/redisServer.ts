// start the redis server
import { resolve } from "path";
import { spawn } from "child_process";
import { Queue, Worker } from "bullmq";
import { app } from "electron";
import IORedis from "ioredis";
const resourcePath = app.isPackaged ? process.resourcesPath : resolve(__dirname, "../../extraResources");
console.log(resourcePath, app.isPackaged);
const memuraiPath = resolve(resourcePath, "./win/memurai.exe");
console.log(resourcePath, memuraiPath);
const PORT = "9001";
spawn(memuraiPath, ["--port", PORT]);

const connection = new IORedis(PORT);

// Reuse the ioredis instance
const myQueue = new Queue("myqueue", { connection });
const myWorker = new Worker("myworker", async (job) => {}, { connection });
