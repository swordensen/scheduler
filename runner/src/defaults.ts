import { Config, Schedule } from "./types";
import { resolve } from "path";
import getPath from "platform-folders";
import { createFolderIfNotExist } from "./helpers";

export const userDataFolder = getPath("userData") as string;
export const appFolder = createFolderIfNotExist(resolve(userDataFolder, "scheduler"));
export const scheduleFile = resolve(appFolder, "schedule.json");
export const configFile = resolve(appFolder, "config.json");
export const logFolder = createFolderIfNotExist(resolve(appFolder, "logs"));
