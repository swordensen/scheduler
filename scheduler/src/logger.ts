import { createLogger, format } from "winston";
import { Console, File } from "winston/lib/winston/transports";

export const LOGGER = createLogger({
  level: "info",
  format: format.timestamp(),
  defaultMeta: { service: "scheduler" },
  transports: [
    new File({ filename: "../logs/error.log", level: "error" }),
    new File({ filename: "../logs/combined.log" }),
    new Console({ format: format.simple() }),
  ],
});
export default LOGGER;
