import { spawn } from "child_process";
import { TaskAction } from "../schema/TaskAction";

export function startTask(task:TaskAction){
    const {command, spawnOptions} = task;
    return spawn(command, spawnOptions)
}