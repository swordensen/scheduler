import { ipcRenderer } from "electron";

const elem = document.querySelector("#runningStatus") as HTMLElement;
let schedulerProcess: {
  pid: number;
  name: string;
} | null;
function changeRunningStatus(status: boolean) {
  if (status) {
    elem.classList.add("running");
    elem.classList.remove("notrunning");
    elem.textContent = "is running";
  } else {
    elem.classList.add("notrunning");
    elem.classList.remove("running");
    elem.textContent = "is not running";
  }
}

ipcRenderer.on("update-running-status", (event, tempSchedulerProcess) => {
  schedulerProcess = tempSchedulerProcess;
  changeRunningStatus(tempSchedulerProcess ? true : false);
});

elem.addEventListener("click", () => {
  if (schedulerProcess) {
    process.kill(schedulerProcess.pid);
    schedulerProcess = null;
    changeRunningStatus(false);
  } else {
    console.log("start scheduler");
    ipcRenderer.send("start-scheduler");
  }
});
