import { TaskAction } from "./TaskAction";
import { TaskCondition } from "./TaskCondition";
import { TaskTrigger } from "./TaskTrigger";

export interface Task{
    actions: TaskAction[];
    conditions: TaskCondition[];
    triggers: TaskTrigger[];
    taskId:string;
    taskGroupId?:string;
}