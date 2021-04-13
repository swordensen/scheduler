import { MyJobData } from "./types";
import { MyJobQueue, MyQueueEvents, MyQueueScheduler, MyWorker } from "./bull";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { v4 as uuid } from "uuid";
import { addToSchedule, getSchedule, removeFromSchedule, removeFromScheduleByName } from "./redis-schedule";

/**
 * this only gets called on the initial page load. Ideally it should
 */
ipcMain.on("get-jobs", async () => {
  const jobs = await getSchedule();
  const repeatableJobs = await MyJobQueue.getRepeatableJobs();
  const _jobs = jobs.map((job) => ({
    ...job,
    repeatData: repeatableJobs.find((rJob) => rJob.name === job.name),
  }));
  mainWindow.webContents.send("schedule", _jobs);
});

ipcMain.on("add-job", async (event, jobData: MyJobData) => {
  jobData.name = uuid();
  const job = await MyJobQueue.add(jobData.name, jobData.data, jobData.jobsOptions);
  await addToSchedule(jobData);
  mainWindow.webContents.send("add-job", jobData);
});

ipcMain.on("start-job", async (event, jobData: MyJobData) => {
  console.log(`starting job ${jobData.name}`);
  delete jobData.jobsOptions.repeat;
  await MyJobQueue.add(jobData.name, jobData.data, jobData.jobsOptions);
});

ipcMain.on("remove-job", async (event, jobData: MyJobData) => {
  console.log(`attempting to remove job with key ${jobData.repeatData.key}`);
  await MyJobQueue.removeRepeatableByKey(jobData.repeatData.key);
  await removeFromScheduleByName(jobData.name);
  mainWindow.webContents.send("remove-job", jobData);
});

// MyQueueEvents.on("completed", async ({ jobId }) => {
//   console.log(`${jobId} completed`);
//   const job = await MyJobQueue.getJob(jobId);
//   const name = job.name;
//   const status = "";
//   mainWindow.webContents.send("update-job-status", { name, status });
// });

MyQueueEvents.on("removed", async ({ jobId }) => {
  console.log(`${jobId} has been removed`);
});
