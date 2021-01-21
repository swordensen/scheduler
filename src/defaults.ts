import {Config, Schedule} from './types'
import path from 'path';

const root = (process as any).pkg ? path.dirname(process.execPath) : __dirname;
export const DEFAULT_CONFIG:Config = {
    scheduleFilePath: path.resolve(root, '../schedule.json')
}

export const DEFAULT_SCHEDULE_FILE:Schedule = [];

export const DEFAULT_CONFIG_PATH = path.resolve(root, '../config.json')