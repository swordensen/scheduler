import { app, BrowserWindow, ipcMain } from 'electron';
import { START_TASK_EVENT } from './eventNames';
import { TaskAction } from '../schema/TaskAction';
import { startTask } from '../API/startTask';

(async () => {
    if(!app.isReady()){
        await app.whenReady();
    }
    
    console.log('establishing event listeners');
    ipcMain.on(START_TASK_EVENT, (event, task:TaskAction)=>{
        startTask(task);
    })
})();
