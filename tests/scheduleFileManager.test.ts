import chai, { expect } from 'chai';
import { existsSync } from 'fs';
import { join } from 'path';
import { DEFAULT_SCHEDULE_FILE } from '../src/defaults';
import { ScheduleFileManager } from '../src/scheduleFileManager';
import { Schedule, Task } from '../src/types';


describe('Schedule File Manager', ()=>{
    const scheduleFileManager = new ScheduleFileManager();

    it('it should be able to read from the schedule file', async ()=>{
        const scheduleFile = await scheduleFileManager.readScheduleFile();
        expect(JSON.stringify(scheduleFile)).to.equal(JSON.stringify(DEFAULT_SCHEDULE_FILE))
    })

    it('it should be able to write to schedule file', async ()=>{
        const newSchedule:Task = {
            name: 'test command', 
            description: 'this is just a test of the schedule file manager',
            commandPath: join(__dirname, 'test.sh'),
            interval: 1000,
            lastExecuted: 0
        }
        const scheduleFile = await scheduleFileManager.readScheduleFile();
        const updatedScheduleFile = [...scheduleFile, newSchedule];
        const writtenScheduleFile = await scheduleFileManager.writeScheduleFile(updatedScheduleFile);
        expect(JSON.stringify(writtenScheduleFile)).to.equal(JSON.stringify(updatedScheduleFile))
    })

    it('it should be able to delete the schedule file', async ()=>{
        await scheduleFileManager.deleteScheduleFile();
    })

})