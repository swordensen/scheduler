const { spawn } = require('child_process');

try{
    console.log(process.argv[2]);
    const bufferData = Buffer.from(process.argv[2], 'base64');
    const bufferstring = bufferData.toString('utf-8');

    const data = JSON.parse(bufferstring);

    const command = data.command;
    const arguments = data.arguments;
    const spawnOptions = data.spawnOptions;
    
    console.log({command});
    
    const childProcess = spawn(command, arguments,{
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
    
}catch(e){
    console.log(e);
}



process.on('SIGINT', () => {
    console.log('Received SIGINT. Cleaning up and exiting.');
    // Perform cleanup tasks here
    process.exit(0);
});


/**
 * keep terminal open
 */
setInterval(()=>{}, 1000);