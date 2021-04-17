export interface Task {
  name: string;
  description?: string;
  command: string;
  interval: number | "startup";
  lastExecuted: number;
  running: boolean;
}

export type Schedule = Task[];

export interface Config {
  scheduleFilePath: string;
}
