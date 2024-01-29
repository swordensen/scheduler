import { TaskAction } from "../../../schema/TaskAction"
import React from 'react';
import rendererEventAPI from "../../../events/rendererEventAPI";
import { START_TASK_EVENT } from "../../../events/eventNames";

declare const eventAPI: typeof rendererEventAPI;

export function TestTaskButton(){
    const testTask:TaskAction = {
        command: "countdown.sh",
        spawnOptions: {
            cwd: "\\c\\Users\\msorensen\\work\\scheduler\\src\\API\\test",
            detached: true,
        }        
    }

    function startTask(){
        eventAPI.startTask(testTask);
    }
    
    return <button onClick={startTask}>START TEST TASK</button>
}