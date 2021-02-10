import "mocha";
import { expect } from "chai";
import { join } from "path";
import { ScheduleRunner } from "../src/scheduleRunner";
import { Task } from "../src/types";

const task_one: Task = {
  name: "test command",
  description: "this is just a test of the schedule file manager",
  command: "echo 'hola mi amigo'",
  interval: 1000,
  lastExecuted: 0,
};

const task_two: Task = {
  name: "test command 2",
  description: "this is just a test 2 of the schedule file manager",
  command: join(__dirname, "test_2.sh"),
  interval: 2000,
  lastExecuted: 0,
};

describe("Schedule Runner", () => {
  const scheduleRunner = new ScheduleRunner();
  let index: number;
  it("it should be able to add a task", () => {
    index = scheduleRunner.scheduleFileManager.addTask(task_one);
    expect(scheduleRunner.schedule).to.deep.include.members([task_one]);
  });

  it("should stop", (done) => {
    setTimeout(() => {
      scheduleRunner.stop();
      done();
    }, 15000);
  }).timeout(15100);

  it("it should be able to remove task ", () => {
    scheduleRunner.scheduleFileManager.deleteTask(index);
  });
});

describe("scheduler after config initialized", () => {
  const scheduleRunner = new ScheduleRunner();
  let index: number;
  it("it should be able to add a schedule", () => {
    index = scheduleRunner.scheduleFileManager.addTask(task_two);
    expect(scheduleRunner.schedule).to.deep.include.members([task_two]);
  });

  it("should stop", function (done) {
    setTimeout(() => {
      scheduleRunner.stop();
      done();
    }, 15000);
  }).timeout(15100);

  it("it should be able to remove task", () => {
    scheduleRunner.scheduleFileManager.deleteTask(index);
  });
});
