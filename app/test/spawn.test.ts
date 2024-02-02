import { spawn } from 'child_process';
import {describe, it} from 'node:test';
import { resolve } from 'path';

describe('something', ()=>{
    it('should do something', async ()=>{
        const tsxPath = "C:\\Users\\msorensen\\AppData\\Roaming\\npm\\tsx.cmd";
        const bashPath = "C:\\Program Files\\Git\\git-bash.exe"
        try{




            // childProcess.stdout.pipe(process.stdout);
            const bashPath = 'C:\\Program Files\\Git\\git-bash.exe'

            const command = "C:\\Users\\msorensen\\projects\\scheduler\\app\\test\\test.bat";
            const _spawnOptions = {
                command: command,
            }

            const spawnOptionsStr = JSON.stringify(_spawnOptions);

            const bufferSpawnOptions = Buffer.from(spawnOptionsStr);

            const encodedSpawnOptions = bufferSpawnOptions.toString('base64');

            // const spawnStr = `"${JSON.stringify(_spawnOptions)}"`;
            const spawnStr = `"${JSON.stringify(_spawnOptions).replace(/\\/g, "\\\\\\\\").replace(/\"/g, "\\\"")}"`;
            const middleManPath = "C:\\Users\\msorensen\\projects\\scheduler\\app\\dist\\main\\assets\\middleMan.js";
            console.log(`"${process.argv[0].replace(/\\/g, "\\\\")}"`, "middleMan.js", encodedSpawnOptions);
            const nodePath = `"${process.argv[0].replace(/\\/g, "\\\\")}"`
            const commandString = `${nodePath} ${middleManPath} ${encodedSpawnOptions}`
            /**
             * SPAWN
             */
            const childProcess = spawn('node', ['middleman.js', encodedSpawnOptions], {
                cwd: __dirname,
                detached: true,
                shell: bashPath
            })
            // childProcess.unref();
            // childProcess.unref();

            childProcess.stdout.pipe(process.stdout);
            childProcess.stderr.pipe(process.stderr);
            process.stdin.pipe(childProcess.stdin);
            childProcess.on('exit', (exitCode, signal)=>{
                console.log({exitCode});
                console.log(signal);
            })
            childProcess.on('spawn', ()=>{
                console.log('spawned')
            })
            childProcess.on('disconnect', ()=>{
                console.log('disconnected')
            })
            childProcess.on('message', (message)=>{
                console.log({message})
            })
            childProcess.on('error', (error)=>{
                console.log({error});
            })
            childProcess.on('close', (code)=>{
                console.log({code});
            })

            
        }catch(e){
            console.log(e);
        }



        await new Promise((resolve, reject)=> setTimeout(resolve, 100000))
    })
})