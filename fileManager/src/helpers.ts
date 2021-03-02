import { existsSync, mkdirSync } from "fs";

export function createFolderIfNotExist(folderPath: string) {
  if (!existsSync(folderPath)) {
    mkdirSync(folderPath);
  }
  return folderPath;
}
