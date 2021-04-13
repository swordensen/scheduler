import { Job, JobJson, JobsOptions } from "bullmq";

export interface JobData {
  name: string;
  description: string;
  task: string;
}

export interface MyJobData {
  name: string; // use the name as the unique identifier
  data: JobData;
  repeatData?: {
    key: string;
    name: string;
    id: string;
    endDate: number;
    tz: string;
    cron: string;
    next: number;
  };
  jobsOptions: JobsOptions;
  startup?: boolean;
  status?: string;
}

export type Schedule = MyJobData[];

export interface Config {
  scheduleFilePath: string;
}

export interface MyJobJson extends JobJson {
  state: string;
  dataJson: any;
  optsJson: JobsOptions;
}
