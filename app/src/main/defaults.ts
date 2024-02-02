import { resolve } from "path";
import { app } from "electron";

import { createFolderIfNotExist } from "./helpers";

export const userDataFolder = app.getPath("userData");

export const appFolder = createFolderIfNotExist(resolve(userDataFolder, "scheduler"));

export const configFile = resolve(appFolder, "config.json");

export const logFolder = createFolderIfNotExist(resolve(appFolder, "logs"));

export const taskLogFolder = createFolderIfNotExist(resolve(logFolder, "tasks"));

export const iconPath = resolve(__dirname, "assets/icon.png");

export const middleManPath = resolve(__dirname, 'assets/middleMan.js');

export const bashPath = resolve(__dirname, "assets/git/git-bash.exe")

export const scheduleFile = resolve(appFolder, "schedule.json");
