import { app } from "electron";
import { createProcessWindow } from "./createProcessWindow";
import { startTask } from "./startTask";
// import { describe, it } from "node:test";

(async ()=>{
    await new Promise((resolve, reject)=>{
        app.on('ready', resolve);
    })

    const _process = startTask({
        command: 'C:/Users/msorensen/work/scheduler/test/countdown.sh' ,
        spawnOptions: {
            detached: true,
            shell: 'C:\\Program Files\\Git\\bin\\bash.exe'
        }       
    }) 

    createProcessWindow(_process);

    await new Promise((resolve, reject)=>{  
        app.on('window-all-closed', ()=>{
            app.quit();
            resolve(true);
        })
    })
})();




// app.on('ready',createProcessWindow(_process));

