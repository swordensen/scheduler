"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleFileManager = void 0;
const fs_1 = require("fs");
const defaults_1 = require("./defaults");
const logger_1 = require("./logger");
/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
class ScheduleFileManager {
    /**
     * returns a readonly schedule. The values in this array should not be changed.
     */
    get schedule() {
        return this.readScheduleFile();
    }
    set _schedule(schedule) {
        this.writeScheduleFile(schedule);
    }
    get _scheduleFileExists() {
        return fs_1.existsSync(defaults_1.scheduleFile);
    }
    constructor() {
        logger_1.LOGGER.info(`creating schedule file manager...`);
    }
    /**
     * creates the schedule file if it doesn't exist.
     * returns schedule
     */
    readScheduleFile() {
        logger_1.LOGGER.info(`reading schedule file ${defaults_1.scheduleFile}...`);
        try {
            if (!this._scheduleFileExists)
                this.initScheduleFile();
            return JSON.parse(fs_1.readFileSync(defaults_1.scheduleFile, "utf8"));
        }
        catch (e) {
            logger_1.LOGGER.error(`unable to parse schedule file ${defaults_1.scheduleFile}`);
            throw e;
        }
    }
    /**
     * returns a schedule whenever the schedule file changes
     * @param cb
     */
    onChange(cb) {
        logger_1.LOGGER.info(`registering schedule file listener...`);
        try {
            fs_1.watchFile(defaults_1.scheduleFile, (curr, prev) => {
                cb(this.schedule);
            });
        }
        catch (e) {
            logger_1.LOGGER.error("unable to establish schedule watch file listener");
        }
    }
    /**
     * adds a task to the schedule file.
     * Keep in mind we only want to read from the file once.
     * @param task
     */
    addTask(task) {
        const currentSchedule = this.schedule;
        this._schedule = [
            ...currentSchedule,
            {
                ...task,
                lastExecuted: 0,
            },
        ];
        return currentSchedule.length;
    }
    /**
     * deletes a task from the schedule file
     * also notifies any listeners, the index of the task that was deleted
     * @param index
     */
    deleteTask(index) {
        const currentSchedule = this.schedule;
        this._schedule = [...currentSchedule.slice(0, index), ...currentSchedule.slice(index + 1)];
    }
    updateTask(index, updatedTask) {
        this._schedule = this.schedule.map((task, i) => {
            if (index == i) {
                return {
                    ...task,
                    ...updatedTask,
                };
            }
            return task;
        });
    }
    /**
     * updates the last executed time.
     * @param index
     * @param lastExecuted
     */
    updateLastExecutedTime(index, lastExecuted) {
        this._schedule = this.schedule.map((task, i) => {
            if (index == i) {
                return {
                    ...task,
                    lastExecuted,
                };
            }
            return task;
        });
    }
    /**
     * writes the schedule file
     * @param scheduleFile
     */
    writeScheduleFile(tasks) {
        logger_1.LOGGER.info(`writing to ${JSON.stringify(defaults_1.scheduleFile)} schedule file ${tasks}`);
        fs_1.writeFileSync(defaults_1.scheduleFile, JSON.stringify(tasks));
        return tasks;
    }
    /**
     * empties schedule file
     */
    clearSchedule() {
        logger_1.LOGGER.info(`clearing schedule file`);
        this._schedule = [];
    }
    /**
     * inits the schedule file with an empty array
     * (same as clear schedule)
     */
    initScheduleFile() {
        logger_1.LOGGER.info(`initializing schedule file`);
        this._schedule = [];
    }
}
exports.ScheduleFileManager = ScheduleFileManager;
//# sourceMappingURL=scheduleFileManager.js.map