import { expect } from "chai";
import { join } from "path";
import { Scheduler } from "../src/scheduler"
import { Schedule } from "../src/types";


const schedule_one:Schedule = {
    name: 'test command', 
    description: 'this is just a test of the schedule file manager',
    commandPath: join(__dirname, 'test.sh'),
    interval: 5000,
    lastExecuted: 0
}

const schedule_two:Schedule = {
    name: 'test command 2', 
    description: 'this is just a test 2 of the schedule file manager',
    commandPath: join(__dirname, 'test_2.sh'),
    interval: 3000,
    lastExecuted: 0
}

describe('Scheduler', ()=>{
    let scheduler:Scheduler 
    it('it should be able to add a schedule', ()=>{
        scheduler = new Scheduler();
        scheduler.addSchedule(schedule_one);
        expect(scheduler.scheduleCollection).to.deep.include.members([schedule_one])
    })

    it('should stop', (done)=>{
        setTimeout(()=>{
            scheduler.stop();
            done();
        }, 15000)
    }).timeout(15100)


})

describe('scheduler after config initialized', ()=>{
    let scheduler:Scheduler 

    it('the scheduler should have the script from before', function(done){
        scheduler = new Scheduler();
        scheduler.onStart(()=>{
            expect(scheduler.scheduleCollection).to.deep.include.members([schedule_one])
            done();
        })
    }).timeout(30000)
    
    it('it should be able to add a schedule', ()=>{
        scheduler.addSchedule(schedule_two);
        expect(scheduler.scheduleCollection).to.deep.include.members([schedule_two])
    })

    it('should stop', function(done){
        setTimeout(()=>{
            scheduler.stop();
            done();
        }, 15000)
    }).timeout(15100)

    it('should clean up', async()=>{
        await scheduler.deleteConfig();
        await scheduler.scheduleFileManager.deleteScheduleFile();
    })
})