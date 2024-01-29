import { ipcRenderer } from "electron";
import { TaskAction } from "../schema/TaskAction";
import { START_TASK_EVENT } from "./eventNames";

export const RENDERER_EVENT_API_KEY = "eventAPI";

export function startTask(task:TaskAction){
    console.log('START TASK CALLED');
    console.log(task);
    ipcRenderer.send(START_TASK_EVENT, task);
}

export default {
    startTask
}