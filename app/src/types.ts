export interface Task {
  name: string;
  description?: string;
  command: string;
  interval?: number;
  cron?: string;
}

export type Schedule = Task[];

export interface Config {
  scheduleFilePath: string;
}
