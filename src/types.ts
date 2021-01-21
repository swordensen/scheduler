export interface Schedule{
    name:string;
    description?:string;
    commandPath:string;
    interval: number | 'startup';
    lastExecuted:number;
}

export type ScheduleFile = Schedule[];

export interface Config{
    scheduleFilePath:string;

}