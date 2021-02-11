import { ChildProcess } from "child_process";
import { resolve } from "path";
import { createLogger, format } from "winston";
import { Console, File } from "winston/lib/winston/transports";
import { logFolder } from "./defaults";

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

export function taskLogger(name: string, process: ChildProcess) {
  const logger = createLogger({
    level: "info",
    transports: [
      new File({ filename: resolve(logFolder, `./commands/${name}.log`) }),
      new File({ filename: resolve(logFolder, `./commands/${name}-error.log`), level: "error" }),
    ],
  });
  logger.info(`attempting to execute ${task.command}`);
  process.stdout?.on("data", (data) => logger.info(data.toString()));
  process.stderr?.on("data", (data) => logger.error(data.toString()));
  process.on("exit", (code) => logger.info(`process exited with code ${code?.toString()}`));
  return logger;
}
export default LOGGER;
