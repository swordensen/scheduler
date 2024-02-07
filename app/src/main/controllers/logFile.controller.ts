import { closeSync, openSync, readFileSync, readSync, statSync, watchFile } from "fs";
import LOGGER from "../logger";
import open from 'open';

const memoryCutoff = 2 * 1024 * 1024 // 2 megabytes

export class LogFileController {
    //only read the last 2 megabytes
    get logFile(){
        const fileSize = statSync(this.path).size;
        const offset = Math.max(0, fileSize - memoryCutoff);
        const fileDescriptor = openSync(this.path, 'r');
        const buffer = Buffer.alloc(fileSize - offset);
        readSync(fileDescriptor, buffer, 0, buffer.length, offset);
        closeSync(fileDescriptor);
        return buffer.toString();
    }

    constructor(private path:string){
        
    }

    onChange(cb:(text:string)=>void){
        LOGGER.info(`registering log file listener...`);
        try {
            cb(this.logFile);
          return watchFile(this.path, (curr, prev) => {
            cb(this.logFile);
          });
        } catch (e) {
          LOGGER.error("unable to establish log file listener");
        }
    }

    openLogFile() {
        open(this.path);
    }
}