import { existsSync, readFileSync, unlink, writeFile } from 'fs';
import path from 'path';
import { DEFAULT_CONFIG } from './defaults';
import { Config, Schedule } from './types';
import { exec } from 'child_process';
import { ScheduleFileManager } from './scheduleFileManager';
import LOGGER from './logger';

/**
 * this singleton is responsible for running the commands at the appropriate time
 * and calling on methods of the config manager to update the config accordingly
 */
export class Scheduler {
    private configPath = path.resolve(__dirname, '../config.json');
    private config = this.getConfig();
    public scheduleFileManager = new ScheduleFileManager(this.config);
    public scheduleCollection: Schedule[] = [];
    private startListeners: Function[] = [];
    private interval?: NodeJS.Timeout;

    constructor() {
        LOGGER.info('creating scheduler')
        this.init().then(()=>{
            this.start();
        });
    }

    public onStart(cb:Function){
        LOGGER.info('registering start listener...')
        this.startListeners?.push(cb);
    }

    private async init() {
        LOGGER.info('initializing scheduler')
        await this.loadScheduleCollectionFromFile();
    }

    public start() {
        LOGGER.info('starting main interval...')
        this.interval = this.mainInterval();
        LOGGER.info('calling start listeners')
        this.startListeners.forEach(listener => listener());
    }

    public stop() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined;
        } else {
            throw 'interval is not definted. Cannot stop. Good Luck.'
        }
    }


    private mainInterval(): NodeJS.Timeout {
        return setInterval(() => {
            LOGGER.info('MAIN INTERVAL LOOP')
            let updated = false;
            this.scheduleCollection = this.scheduleCollection.map((schedule => {
                LOGGER.info(schedule.name)
                if (this.timeToRun(schedule)) {
                    updated = true;
                    exec(schedule.commandPath);
                    return {
                        ...schedule,
                        lastExecuted: Date.now()
                    }
                }
                return schedule
            }))
            if(updated) this.scheduleFileManager.writeScheduleFile(this.scheduleCollection)
            LOGGER.info('MAIN INTERVAL LOOP END')
        }, 1000)
    }

    /**
     * decides if it's time to run the command. Based on the interval provided
     * and the time it was last ran
     * @param schedule 
     */
    private timeToRun(schedule: Schedule): boolean {
        if (schedule.interval !== 'startup') {
            const currentTime = Date.now();
            const scheduledTime = schedule.lastExecuted + schedule.interval;
            if (currentTime > scheduledTime) return true;
        }
        return false;
    }


    private async loadScheduleCollectionFromFile() {
        LOGGER.info('loading schedule collection from scheduleFileManager...')
        this.scheduleCollection = await this.scheduleFileManager.readScheduleFile();
    }

    public addSchedule(schedule: Schedule) {
        LOGGER.info(`Adding a new schedule ${schedule.name}`)
        this.scheduleCollection = [...this.scheduleCollection, schedule];
        this.scheduleFileManager.writeScheduleFile(this.scheduleCollection);
    }

    private getConfig(): Config {
        LOGGER.info('getting scheduler config')
        if (existsSync(this.configPath)) {
            LOGGER.info('config file exists!')
            const configStr = readFileSync(this.configPath, 'utf8')
            try {
                return JSON.parse(configStr);
            } catch (e) {
                LOGGER.error(`unable to parse config file text: ${configStr}`)
            }
        }
        LOGGER.info('creating a new config file with default values');
        writeFile(this.configPath, JSON.stringify(DEFAULT_CONFIG), () => {/*done writing file */ });
        return DEFAULT_CONFIG;

    }

    public deleteConfig(): Promise<void> {
        LOGGER.info(`deleting config file! ${this.configPath}`)
        return new Promise((resolve, reject) => {
            unlink(this.configPath, (err) => {
                if(err){
                    LOGGER.error(`unable to delete config file ${this.configPath}`)
                }
                resolve()
            })
        })
    }
}

