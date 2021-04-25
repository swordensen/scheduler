// import { ChildProcess } from "child_process";
import { ChildProcess } from "child_process";
import open from "open";
import { resolve } from "path";
import { createLogger, format } from "winston";
import { Console, File } from "winston/lib/winston/transports";
import { logFolder } from "./defaults";
import { Task } from "./types";

export const LOGGER = createLogger({
  level: "info",
  format: format.timestamp(),
  defaultMeta: { service: "scheduler" },
  transports: [
    new File({ filename: resolve(logFolder, "error.log"), level: "error" }),
    new File({ filename: resolve(logFolder, "combined.log") }),
    // new Console({ format: format.simple() }),
  ],
});

export function createTaskLogger(task: Task) {
  return createLogger({
    level: "info",
    transports: [
      new File({ filename: resolve(logFolder, `./commands/${task.name}.log`) }),
      new File({ filename: resolve(logFolder, `./commands/${task.name}-error.log`), level: "error" }),
    ],
  });
}

export function taskLogger(task: Task, _process: ChildProcess) {
  const logger = createTaskLogger(task);
  logger.info(`attempting to execute ${task.command}`);
  _process.stdout?.on("data", (data) => logger.info(data.toString()));
  _process.stderr?.on("data", (data) => logger.error(data.toString()));
  _process.on("exit", (code) => logger.info(`process exited with code ${code?.toString()}`));
  return logger;
}

export function openLogFile(task: Task) {
  const path = resolve(logFolder, `./commands/${task.name}.log`);
  open(path);
}
export default LOGGER;
