// import { ChildProcess } from "child_process";
import { ChildProcess } from "child_process";
import open from "open";
import { resolve } from "path";
import { createLogger, format } from "winston";
import { Console, File } from "winston/lib/winston/transports";
import { logFolder } from "./defaults";
import { Task } from "./types";
import { createWriteStream } from "fs";

export const LOGGER = createLogger({
  level: "info",
  format: format.timestamp(),
  defaultMeta: { service: "scheduler" },
  transports: [
    new File({ filename: resolve(logFolder, "error.log"), level: "error" }),
    new File({ filename: resolve(logFolder, "combined.log") }),
    new Console({ format: format.simple() }),
  ],
});

export function createTaskLogger(task: Task) {
  return createLogger({
    level: "info",
    transports: [
      new File({ filename: resolve(logFolder, `./commands/${task.name}-${task.id}.log`) }),
      new File({ filename: resolve(logFolder, `./commands/${task.name}-${task.id}-error.log`), level: "error" }),
    ],
  });
}

export function taskLogger(task: Task, _process: ChildProcess) {
  // const logger = createTaskLogger(task);
  const logFilePath = task.logFilePath;
  const logFileWriteStream = createWriteStream(logFilePath, {flags: 'a'});
  _process.stdout.pipe(logFileWriteStream);
  _process.stderr.pipe(logFileWriteStream)

}


export default LOGGER;
