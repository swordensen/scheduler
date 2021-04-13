import { JobsOptions } from "bullmq";
import { connection as redis } from "./bull";
import { MyJobData, Schedule } from "./types";

const SCHEDULE_TABLE_NAME = "schedule";

// on startup
startup();
async function startup() {
  const schedule = await getSchedule();
  if (!schedule) await setSchedule([]);
}

export function setSchedule(schedule: Schedule) {
  return redis.set(SCHEDULE_TABLE_NAME, JSON.stringify(schedule));
}

export async function getSchedule(): Promise<Schedule> {
  const scheduleString = await redis.get(SCHEDULE_TABLE_NAME);
  return JSON.parse(scheduleString);
}

export async function addToSchedule(jobsOptions: MyJobData) {
  const schedule = await getSchedule();
  schedule.push(jobsOptions);
  await setSchedule(schedule);
  return getSchedule();
}

export async function removeFromSchedule(index: number) {
  const schedule = await getSchedule();
  const newSchedule = [...schedule.slice(0, index), ...schedule.slice(index + 1)];
  await setSchedule(newSchedule);
  return newSchedule;
}

export async function removeFromScheduleByName(name: string) {
  const schedule = await getSchedule();
  const index = schedule.findIndex((job) => job.name === name);
  const newSchedule = [...schedule.slice(0, index), ...schedule.slice(index + 1)];
  await setSchedule(newSchedule);
  return newSchedule;
}
