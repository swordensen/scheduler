export interface Task {
  name: string;
  description?: string;
  commandPath: string;
  interval: number | "startup";
  lastExecuted: number;
}

export type Schedule = Task[];

export interface Config {
  scheduleFilePath: string;
}
