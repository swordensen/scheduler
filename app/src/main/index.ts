try {
  require("electron-reloader")(module);
} catch {}
import { app } from "electron";
import { setup } from "./window-setup";
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
} else {
  require("update-electron-app")();
}

app.on("ready", () => setup());
