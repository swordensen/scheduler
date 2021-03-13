import { resolve } from "path";
import { app } from "electron";
import { createFolderIfNotExist } from "./helpers";
import { Schedule } from "../types";

export const userDataFolder = app.getPath("userData");

if (!userDataFolder) throw "Unknown operating system detected. Unable to locate configuration folder.";

export const appFolder = createFolderIfNotExist(resolve(userDataFolder, "scheduler"));

export const scheduleFile = resolve(appFolder, "schedule.json");

export const configFile = resolve(appFolder, "config.json");

export const logFolder = createFolderIfNotExist(resolve(appFolder, "logs"));

export const defaultSchedule: Schedule = [];
