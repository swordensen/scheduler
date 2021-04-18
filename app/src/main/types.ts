export interface Task {
  id: string;
  name: string;
  description?: string;
  command: string;
  interval?: number;
  startup: boolean;
  lastExecuted?: number;
  next?: number;
  cron?: string;
  status: "active" | "waiting" | "failed";
}

export type Schedule = Task[];

export interface Config {
  scheduleFilePath: string;
}
