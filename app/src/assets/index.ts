import { readFileSync } from "fs";
import { resolve } from "path";
import { Config } from "../../../src/types";
import { ScheduleFileManager } from "../../../src/scheduleFileManager";

const configFile = readFileSync(resolve(process.cwd(), "config.json"), "utf8");

const config: Config = JSON.parse(configFile);

const scheduleFileManager = new ScheduleFileManager(config);

console.log(scheduleFileManager.readScheduleFile());
