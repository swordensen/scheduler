"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultSchedule = exports.logFolder = exports.configFile = exports.scheduleFile = exports.appFolder = exports.userDataFolder = void 0;
const path_1 = require("path");
const helpers_1 = require("./helpers");
const platform_folders_1 = __importDefault(require("platform-folders"));
exports.userDataFolder = platform_folders_1.default("userData");
if (!exports.userDataFolder)
    throw "Unknown operating system detected. Unable to locate configuration folder.";
exports.appFolder = helpers_1.createFolderIfNotExist(path_1.resolve(exports.userDataFolder, "scheduler"));
exports.scheduleFile = path_1.resolve(exports.appFolder, "schedule.json");
exports.configFile = path_1.resolve(exports.appFolder, "config.json");
exports.logFolder = helpers_1.createFolderIfNotExist(path_1.resolve(exports.appFolder, "logs"));
exports.defaultSchedule = [];
//# sourceMappingURL=defaults.js.map