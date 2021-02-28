import { Schedule, Task } from "./types";
/**
 * this singleton is responsible for managing the schedule file to ensure no
 * race conditions
 */
export declare class ScheduleFileManager {
    /**
     * returns a readonly schedule. The values in this array should not be changed.
     */
    get schedule(): readonly Task[];
    private set _schedule(value);
    private get _scheduleFileExists();
    constructor();
    /**
     * creates the schedule file if it doesn't exist.
     * returns schedule
     */
    private readScheduleFile;
    /**
     * returns a schedule whenever the schedule file changes
     * @param cb
     */
    onChange(cb: (schedule: Readonly<Schedule>) => void): void;
    /**
     * adds a task to the schedule file.
     * Keep in mind we only want to read from the file once.
     * @param task
     */
    addTask(task: Task): number;
    /**
     * deletes a task from the schedule file
     * also notifies any listeners, the index of the task that was deleted
     * @param index
     */
    deleteTask(index: number): void;
    updateTask(index: number, updatedTask: Partial<Task>): void;
    /**
     * updates the last executed time.
     * @param index
     * @param lastExecuted
     */
    updateLastExecutedTime(index: number, lastExecuted: number): void;
    /**
     * writes the schedule file
     * @param scheduleFile
     */
    private writeScheduleFile;
    /**
     * empties schedule file
     */
    clearSchedule(): void;
    /**
     * inits the schedule file with an empty array
     * (same as clear schedule)
     */
    private initScheduleFile;
}
