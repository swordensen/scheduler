import { resolve } from "path";
import { app } from "electron";
import { redisPort, userDataFolder } from "./defaults";
import { existsSync, openSync } from "fs";
import { spawn } from "child_process";

// get resource path based on whether or not we're in development mode
const resourcePath = app.isPackaged ? process.resourcesPath : resolve(__dirname, "../extraResources");
const memuraiPath = resolve(resourcePath, "./win/memurai.exe");
const configFilePath = resolve(resourcePath, "./win/memurai.conf");
const logFilePath = resolve(userDataFolder, "memurai-log.txt");
const workDirectoryPath = userDataFolder;

// we need to create the log file because redis won't do that for us for some fucking reason
if (!existsSync(logFilePath)) openSync(logFilePath, "w");

// start redis server
spawn(memuraiPath, [configFilePath, "--port", redisPort, "--logfile", logFilePath, "--dir", workDirectoryPath]);
