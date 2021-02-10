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
export default LOGGER;
