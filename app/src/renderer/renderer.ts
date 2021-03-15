import "./styles.scss";

import { MDCTextField } from "@material/textfield";
import { MDCTopAppBar } from "@material/top-app-bar";
import { ipcRenderer, remote } from "electron";

import "./clock";
import { MDCLinearProgress } from "@material/linear-progress";
import { MDCSelect } from "@material/select";

const scheduleContainer = document.getElementById("schedule");

const progressBarElem = document.querySelector("#loader") as HTMLElement;
const linearProgress = new MDCLinearProgress(progressBarElem);

ipcRenderer.on("schedule", (event, schedule) => {
  renderSchedule(schedule);
});

function renderSchedule(
  jobs: {
    key: string;
    name: string;
    id: string;
    endDate: number;
    tz: string;
    cron: string;
    next: number;
  }[]
) {
  if (!scheduleContainer) return;
  scheduleContainer.innerHTML = "";
  jobs.forEach((job, i: number) => {
    const taskElem = document.createElement("div");
    taskElem.classList.add("mdc-card");
    taskElem.classList.add("task");
    const scheduled = new Date(job.next);
    taskElem.innerHTML = `
            <div class="taskDetails">
              <p>${job.name}</p>
              <p>${scheduled.toLocaleString()}</p>
            </div>
            <div class="actions">
              <div class="mdc-touch-target-wrapper">
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="startTask(${i})">
                  <div class="mdc-fab__ripple"></div>
                  <span class="material-icons mdc-fab__icon">play_arrow</span>
                  <div class="mdc-fab__touch"></div>
                </button>
              </div>
              <div class="mdc-touch-target-wrapper">
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="openLog(${i})">
                  <div class="mdc-fab__ripple"></div>
                  <span class="material-icons mdc-fab__icon">text_snippet</span>
                  <div class="mdc-fab__touch"></div>
                </button>
              </div>
              <div class="mdc-touch-target-wrapper">
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="deleteJob('${job.key}')">
                  <div class="mdc-fab__ripple"></div>
                  <span class="material-icons mdc-fab__icon">delete</span>
                  <div class="mdc-fab__touch"></div>
                </button>
              </div>
            </div>
          `;
    scheduleContainer.append(taskElem);
  });
  linearProgress.close();
}
// initialize elements

const commandElem = document.querySelector("#command") as HTMLElement;
const commandField = new MDCTextField(commandElem);

const nameElem = document.querySelector("#name") as HTMLElement;
const nameField = new MDCTextField(nameElem);

const intervalElem = document.querySelector("#interval") as HTMLElement;
const intervalSelect = new MDCSelect(intervalElem);

const descriptionElem = document.querySelector("#description") as HTMLElement;
const descriptionField = new MDCTextField(descriptionElem);

const topAppBarElement = document.querySelector(".mdc-top-app-bar") as HTMLElement;
const topAppBar = new MDCTopAppBar(topAppBarElement);

const form = document.querySelector("#taskForm") as HTMLFormElement;
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = commandField.value;
  const name = nameField.value;
  const interval = intervalSelect.value;
  const description = descriptionField.value;

  ipcRenderer.send("add-task", {
    command,
    name,
    interval: 10000,
    description,
  });
  linearProgress.open();
});

(window as any).deleteJob = (key: string) => {
  console.log("trying to delete job", key);
  ipcRenderer.send("delete-task", key);
  linearProgress.open();
};

(window as any).openLog = (index: number) => {
  ipcRenderer.send("open-log", index);
};

(window as any).startTask = (index: number) => {
  ipcRenderer.send("start-task", index);
  linearProgress.open();
};

const browseButtonElem = document.querySelector("#browse") as HTMLButtonElement;
browseButtonElem.onclick = async (e) => {
  e.preventDefault();
  const response = await remote.dialog.showOpenDialog({ properties: ["openFile"] });
  commandField.value = response.filePaths[0] || "";
};

const minimizeButton = document.querySelector("#minimize") as HTMLButtonElement;
const maximizeButton = document.querySelector("#maximize") as HTMLButtonElement;
const closeButton = document.querySelector("#close") as HTMLButtonElement;

minimizeButton.addEventListener("click", () => {
  remote.getCurrentWindow().minimize();
});

maximizeButton.addEventListener("click", () => {
  const window = remote.getCurrentWindow();
  if (window.isMaximized()) {
    return window.restore();
  }
  window.maximize();
});

closeButton.addEventListener("click", () => {
  remote.getCurrentWindow().hide();
});

ipcRenderer.send("get-schedule");
ipcRenderer.send("get-jobs");
