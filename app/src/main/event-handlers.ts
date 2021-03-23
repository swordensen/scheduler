import { Task } from "./types";
import { MyJobQueue } from "./bull";
import { ipcMain } from "electron";
import { mainWindow } from "./window-setup";
import { JobsOptions } from "bullmq";

ipcMain.on("get-jobs", async () => {
  console.log("getting jobs");
  const jobs = await MyJobQueue.getJobs("delayed");
  console.log(jobs);
  const jsonJobs = jobs.map((job) => job?.asJSON());
  mainWindow.webContents.send("schedule", jsonJobs);
});

ipcMain.on(
  "add-job",
  async (event, { name, data, jobsOptions }: { name: string; data: any; jobsOptions: JobsOptions }) => {
    jobsOptions.jobId = Date.now().toString();
    const job = await MyJobQueue.add(name, data, jobsOptions);

    const jobs = await MyJobQueue.getJobs("delayed");
    const jsonJobs = jobs.map((job) => job?.asJSON());
    mainWindow.webContents.send("schedule", jsonJobs);
  }
);

ipcMain.on("delete-task", async (event, key: string) => {
  await MyJobQueue.removeRepeatableByKey(key);
});

ipcMain.on("start-task", async (event, jobId) => {
  console.log("trying to start", jobId);

  const job = await MyJobQueue.getJob(jobId);
  console.log(job);
  // MyJobQueue.add(job.name, job.data);
});

ipcMain.on("open-log", (event, index) => {});

ipcMain.on("get-schedule", async (event) => {
  await MyJobQueue.waitUntilReady();
  const jobs = await MyJobQueue.getRepeatableJobs();

  mainWindow.webContents.send("schedule", jobs);
});
