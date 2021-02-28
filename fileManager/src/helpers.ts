import { existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { logFolder } from "./defaults";
import { Task } from "./types";

export function createFolderIfNotExist(folderPath: string) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }
  return folderPath;
}

/**
 * this function opens up the log file for viewing
 */
export function openLogFile(task: Task) {
  const path = resolve(logFolder, `./commands/${task.name}.log`);
  if (existsSync(path)) open(path);
}
