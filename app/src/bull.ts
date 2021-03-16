import { Processor, Queue, QueueScheduler, Worker } from "bullmq";
import { queueName, redisPort } from "./defaults";
import { Task } from "./types";
import IORedis from "ioredis";
import { cpus } from "os";
import { exec } from "child_process";

/**
 * we could work with one worker but, that wouldn't be fun
 */
const concurrency = cpus.length;
const cores = cpus.length;

// establish connection with redis server
const connection = IORedis(redisPort);

// create jobQueue
export const MyJobQueue = new Queue(queueName, { connection });

// create queue schedule (required for repeatable jobs)
export const MyQueueScheduler = new QueueScheduler(queueName, { connection });

// create workers
const executionFunction: Processor = async (job: any) => {
  const task = job as Task;
  const _process = exec(task.command);
};
const workers = [];
for (let i = 0; i < cores; i++) {
  workers.push(new Worker(queueName, executionFunction, { connection, concurrency }));
}

// clean exit
process.on("exit", () => {
  MyJobQueue.close();
  MyQueueScheduler.close();
});
