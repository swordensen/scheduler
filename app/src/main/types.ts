export interface Task {
  id: string;
  name: string;
  description?: string;
  command: string;
  arguments?: string[];
  interval?: string;
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
