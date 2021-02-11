import { expect } from "chai";
import "mocha";
import { defaultSchedule, scheduleFile } from "../src/defaults";
import { ScheduleFileManager } from "../src/scheduleFileManager";
import { Task } from "../src/types";

describe("Schedule File Manager", () => {
  const testTask: Task = {
    name: "test task",
    description: "this is just a test",
    command: "echo 'hola mi amigo'",
    interval: 15000,
    lastExecuted: 0,
  };

  const scheduleFileManager = new ScheduleFileManager();
  let index: number;
  try {
    it("should be able to clear schedule", () => {
      scheduleFileManager.clearSchedule();
      expect(JSON.stringify(scheduleFileManager.schedule)).to.equal(JSON.stringify(defaultSchedule));
    });
    it("should be able to add task", () => {
      index = scheduleFileManager.addTask(testTask);
      expect(JSON.stringify(scheduleFileManager.schedule)).to.equal(JSON.stringify([testTask]));
    });
    it("should be able to update last executed time", () => {
      const newTime = Date.now();
      scheduleFileManager.updateLastExecutedTime(index, newTime);
      expect(JSON.stringify(scheduleFileManager.schedule)).to.equal(
        JSON.stringify([{ ...testTask, lastExecuted: newTime }])
      );
    });
    it("should be able to update task", () => {
      const updatedTask: Partial<Task> = {
        name: "updated test task",
        lastExecuted: Date.now(),
      };
      scheduleFileManager.updateTask(index, updatedTask);
      expect(JSON.stringify(scheduleFileManager.schedule)).to.equal(JSON.stringify([{ ...testTask, ...updatedTask }]));
    });
    it("should be able to remove recently added task", () => {
      scheduleFileManager.deleteTask(index);
      expect(JSON.stringify(scheduleFileManager.schedule)).to.equal(JSON.stringify(defaultSchedule));
    });
    scheduleFileManager.clearSchedule();
  } catch (e) {
    scheduleFileManager.clearSchedule();
  }
});
