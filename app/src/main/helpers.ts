import { existsSync, mkdirSync } from "fs";
import { spawn, spawnSync } from "child_process";

export function createFolderIfNotExist(folderPath: string) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }
  return folderPath;
}

export const spacesNotInQuotesRegex = /\s+(?=([^"]*"[^"]*")*[^"]*$)/g;

export function killProcess(pid: number) {
  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", `${pid}`, "/f", "/t"]);
    } else {
      process.kill(pid);
    }
  } catch (e) {
    console.log(`unable to kill process ${pid}`);
  }
}

export function killProcessSync(pid: number) {
  try {
    spawnSync("taskkill", ["/pid", `${pid}`, "/f", "/t"]);
  } catch (e) {
    console.log(`couldn't kill process id: ${pid}`);
  }
}
