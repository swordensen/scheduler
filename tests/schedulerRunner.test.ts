import { expect } from "chai";
import { join } from "path";
import { ScheduleRunner } from "../src/schedulerRunner"
import {  Task } from "../src/types";


const task_one:Task = {
    name: 'test command', 
    description: 'this is just a test of the schedule file manager',
    commandPath: join(__dirname, 'test.sh'),
    interval: 5000,
    lastExecuted: 0
}

const task_two:Task = {
    name: 'test command 2', 
    description: 'this is just a test 2 of the schedule file manager',
    commandPath: join(__dirname, 'test_2.sh'),
    interval: 3000,
    lastExecuted: 0
}

describe('Schedule Runner', ()=>{
    let scheduleRunner:ScheduleRunner 
    it('it should be able to add a task', ()=>{
        scheduleRunner = new ScheduleRunner();
        scheduleRunner.addTask(task_one);
        expect(scheduleRunner.schedule).to.deep.include.members([task_one])
    })

    it('should stop', (done)=>{
        setTimeout(()=>{
            scheduleRunner.stop();
            done();
        }, 15000)
    }).timeout(15100)


})

describe('scheduler after config initialized', ()=>{
    let scheduleRunner:ScheduleRunner 

    it('the scheduler should have the script from before', ()=>{
        scheduleRunner = new ScheduleRunner();
        expect(scheduleRunner.schedule).to.deep.include.members([task_one])

    })
    
    it('it should be able to add a schedule', ()=>{
        scheduleRunner.addTask(task_two);
        expect(scheduleRunner.schedule).to.deep.include.members([task_two])
    })

    it('should stop', function(done){
        setTimeout(()=>{
            scheduleRunner.stop();
            done();
        }, 15000)
    }).timeout(15100)

    // it('should clean up', async()=>{
    //     await scheduleRunner.deleteConfig();
    //     await scheduleRunner.scheduleFileManager.deleteScheduleFile();
    // })
})