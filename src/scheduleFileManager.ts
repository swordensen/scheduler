import { existsSync, readFile, readFileSync, unlink, writeFile, writeFileSync } from "fs";
import { DEFAULT_CONFIG, DEFAULT_SCHEDULE_FILE } from "./defaults";
import LOGGER from "./logger";
import { Config, Schedule } from "./types";

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
    public readScheduleFile():Schedule{
        LOGGER.info(`reading schedule file ${this.config.scheduleFilePath}...`)
        try{
            return JSON.parse(readFileSync(this.config.scheduleFilePath, 'utf8'))
        }catch(e){
            LOGGER.error(`unable to parse schedule file ${this.config.scheduleFilePath}`);
            throw e;
        }
    }

    /**
     * writes the schedule file
     * @param scheduleFile 
     */
    public writeScheduleFile(scheduleFile:Schedule):Schedule{
        LOGGER.info( `writing to ${JSON.stringify(scheduleFile)} schedule file ${this.config.scheduleFilePath}`)
        writeFileSync(this.config.scheduleFilePath, JSON.stringify(scheduleFile), 'utf8');
        return scheduleFile;
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
            writeFileSync(this.config.scheduleFilePath, '[]', 'utf8')
        }
    }
}