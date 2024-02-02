import { spawn } from "child_process";



const data= JSON.parse(process.argv[2]);

const command = data.command;
const spawnOptions = data.spawnOptions;

const childProcess = spawn(command, {
    ...spawnOptions,
    windowsHide: true
});

childProcess.stdout.pipe(process.stdout);
childProcess.stderr.pipe(process.stderr);
process.stdin.pipe(childProcess.stdin);

childProcess.on('error', (error)=>{
    console.log(error);
})

childProcess.on('close', (exitcode)=>{
    process.exit(exitcode);
})



process.on('SIGINT', () => {
    console.log('Received SIGINT. Cleaning up and exiting.');
    // Perform cleanup tasks here
    process.exit(0);
});


/**
 * keep terminal open
 */
setInterval(()=>{}, 1000);

