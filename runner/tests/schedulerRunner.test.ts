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
