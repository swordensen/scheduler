"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskLogger = exports.createTaskLogger = exports.LOGGER = void 0;
// import { ChildProcess } from "child_process";
const path_1 = require("path");
const winston_1 = require("winston");
const transports_1 = require("winston/lib/winston/transports");
const defaults_1 = require("./defaults");
exports.LOGGER = winston_1.createLogger({
    level: "info",
    format: winston_1.format.timestamp(),
    defaultMeta: { service: "scheduler" },
    transports: [
        new transports_1.File({ filename: path_1.resolve(defaults_1.logFolder, "error.log"), level: "error" }),
        new transports_1.File({ filename: path_1.resolve(defaults_1.logFolder, "combined.log") }),
        new transports_1.Console({ format: winston_1.format.simple() }),
    ],
});
function createTaskLogger(task) {
    return winston_1.createLogger({
        level: "info",
        transports: [
            new transports_1.File({ filename: path_1.resolve(defaults_1.logFolder, `./commands/${task.name}.log`) }),
            new transports_1.File({ filename: path_1.resolve(defaults_1.logFolder, `./commands/${task.name}-error.log`), level: "error" }),
        ],
    });
}
exports.createTaskLogger = createTaskLogger;
function taskLogger(task, proces) {
    var _a, _b;
    const logger = createTaskLogger(task);
    logger.info(`attempting to execute ${task.command}`);
    (_a = process.stdout) === null || _a === void 0 ? void 0 : _a.on("data", (data) => logger.info(data.toString()));
    (_b = process.stderr) === null || _b === void 0 ? void 0 : _b.on("data", (data) => logger.error(data.toString()));
    process.on("exit", (code) => logger.info(`process exited with code ${code === null || code === void 0 ? void 0 : code.toString()}`));
    return logger;
}
exports.taskLogger = taskLogger;
exports.default = exports.LOGGER;
//# sourceMappingURL=logger.js.map