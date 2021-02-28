import { Task } from "./types";
export declare const LOGGER: import("winston").Logger;
export declare function createTaskLogger(task: Task): import("winston").Logger;
export declare function taskLogger(task: Task, proces: any): import("winston").Logger;
export default LOGGER;
