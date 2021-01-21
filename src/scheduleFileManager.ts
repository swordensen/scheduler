import { existsSync, readFile, unlink, writeFile, writeFileSync } from "fs";
import { DEFAULT_CONFIG, DEFAULT_SCHEDULE_FILE } from "./defaults";
import LOGGER from "./logger";
import { Config, ScheduleFile } from "./types";

/**
 * this singleton is responsible for managing the schedule file to ensure no 
 * race conditions
 */
export class ScheduleFileManager{
    public config: Config;
    constructor(config?:Config){
        LOGGER.info( 'creating schedule file manager...')
        this.config = config || DEFAULT_CONFIG;
        this.initScheduleFile();
    }

    /**
     * reads the schedule file
     */
    public readScheduleFile():Promise<ScheduleFile>{
        LOGGER.info(`reading schedule file ${this.config.scheduleFilePath}...`)
        return new Promise((resolve, reject)=>{
            readFile(this.config.scheduleFilePath, 'utf8', (err, data)=>{
                if(err) {
                    LOGGER.error(`unable to read schedule file ${this.config.scheduleFilePath}`)
                    reject(err)
                };
                resolve(JSON.parse(data))
            })
        })
    }

    /**
     * writes the schedule file
     * @param scheduleFile 
     */
    public writeScheduleFile(scheduleFile:ScheduleFile):Promise<ScheduleFile>{
        LOGGER.info( `writing to schedule file ${this.config.scheduleFilePath}`)
        return new Promise((resolve, reject)=>{
            writeFile(this.config.scheduleFilePath, JSON.stringify(scheduleFile), 'utf8', (err)=>{
                if(err) {
                    LOGGER.error(`unable to write ${JSON.stringify(scheduleFile)} to ${this.config.scheduleFilePath}`)
                    reject(err);
                };
                resolve(scheduleFile)
            })
        })
    }
    /**
     * deletes schedule file
     */
     public deleteScheduleFile():Promise<void>{
         LOGGER.info( `deleting schedule file ${this.config.scheduleFilePath}`)
         return new Promise((resolve, reject)=>{
             unlink(this.config.scheduleFilePath, (err)=>{
                 if(err){
                     LOGGER.error(`unable to delete ${this.config.scheduleFilePath}`)
                     reject(err)
                 };
                 resolve();
             })
         })
     }

    /**
     * checks to see if a schedule file exists
     * otherwise creates one with default config
     */
    private initScheduleFile(){
        LOGGER.info(`initializing schedule file`)
        if(!existsSync(this.config.scheduleFilePath)){
            LOGGER.info(`schedule file does not exist. Creating one with default values.`)
            writeFileSync(this.config.scheduleFilePath, JSON.stringify(DEFAULT_SCHEDULE_FILE), 'utf8')
        }
    }
}