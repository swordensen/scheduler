import { describe, it } from "node:test";
import { startTask } from "./startTask";

describe('Start Task', ()=>{
    it('should be able to start task', async ()=>{
        const _process = startTask({
            command: 'C:/Users/msorensen/work/scheduler/test/countdown.sh' ,
            spawnOptions: {
                detached: true,
                shell: 'C:\\Program Files\\Git\\bin\\bash.exe'
            }       
        })
        _process.on('message', (message)=> console.log(message));
        _process.stdout.pipe(process.stdout);

        await new Promise((resolve, reject)=>{
            _process.on('error', (e)=> reject(e));
            _process.on('close', ()=>{
                console.log('process closing');
                resolve(true);
            });
            
        })
    })
})