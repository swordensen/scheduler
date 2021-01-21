import {Config, ScheduleFile} from './types'
import path from 'path';
export const DEFAULT_CONFIG:Config = {
    scheduleFilePath: path.resolve(__dirname, '../schedule.json')
}

export const DEFAULT_SCHEDULE_FILE:ScheduleFile = [];