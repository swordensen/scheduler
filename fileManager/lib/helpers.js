"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openLogFile = exports.createFolderIfNotExist = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const defaults_1 = require("./defaults");
function createFolderIfNotExist(folderPath) {
    if (!fs_1.existsSync(folderPath)) {
        fs_1.mkdirSync(folderPath);
    }
    return folderPath;
}
exports.createFolderIfNotExist = createFolderIfNotExist;
/**
 * this function opens up the log file for viewing
 */
function openLogFile(task) {
    const path = path_1.resolve(defaults_1.logFolder, `./commands/${task.name}.log`);
    if (fs_1.existsSync(path))
        open(path);
}
exports.openLogFile = openLogFile;
//# sourceMappingURL=helpers.js.map