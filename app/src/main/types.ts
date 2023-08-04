export interface Task {
  id: string;
  name: string;
  description?: string;
  command: string;
  arguments?: string[];
  triggers: UTrigger[];
  lastExecuted?: number;
  pids: number[];
  status: "active" | "waiting" | "failed";
}

export type TriggerType = "startup" | "interval" | "CRON";

export interface Trigger {
  id?: string;
  type: TriggerType;
}

export type UTrigger = StartupTrigger | IntervalTrigger | CRONTrigger;

export interface StartupTrigger extends Trigger {
  type: "startup";
}

export interface IntervalTrigger extends Trigger {
  type: "interval";
  value: number;
  next: number;
}

export interface CRONTrigger extends Trigger {
  type: "CRON";
  value: string;
  next: number;
}

export type Schedule = Array<Task>;

export interface Config {
  scheduleFilePath: string;
}
