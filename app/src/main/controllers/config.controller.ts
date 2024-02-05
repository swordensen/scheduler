import { readFileSync, watchFile, writeFile, writeFileSync } from "fs";
import { configFile, scheduleFile } from "../defaults";
import LOGGER from "../logger";
import { Config } from "../types";

const defaultConfig:Config = {
    bashPath: "C:\\Program Files\\Git\\git-bash.exe",
    theme: "dark",
    scheduleFilePath: scheduleFile
}

export class ConfigController {
    public get config(){
        return Object.freeze(this.readConfigFile());
    }

    public set config(newConfig:Config){
        this.writeConfigFile(newConfig);
    }

    constructor(){
        /**
         * used to initialize the config file if it does not already exist
         */
        this.readConfigFile();
    }

    private readConfigFile():Config{
        LOGGER.info(`reading config file ${configFile}...`);
        try{
            return JSON.parse(readFileSync(configFile, 'utf-8'))
        }catch(e){
            LOGGER.error(`unable to parse config file ${configFile}`);
            this.config = defaultConfig;
            return this.config;
        }
    }

    private writeConfigFile(newConfig:Config){
        LOGGER.info(`writing config file ${configFile}`)
        try{
            writeFileSync(configFile,JSON.stringify(newConfig, null, '\t'), 'utf-8');
            return this.config;
        }catch(e){
            LOGGER.error(`unable to write to config file ${configFile}`);
        }
    }

    public onChange(cb:(config:Readonly<Config>)=>void){
        LOGGER.info(`registering config file change listener`);
        try{
            watchFile(configFile, (curr, prev)=>{
                cb(this.config);
            })
        }catch(e){
            console.log(e)
            LOGGER.error("unable to establish config watch file listener");
        }
    }
}