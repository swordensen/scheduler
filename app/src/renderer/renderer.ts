import "./styles.scss";

import { Task } from "../fileManager/types";
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

function renderSchedule(schedule: readonly Task[]) {
  if (!scheduleContainer) return;
  scheduleContainer.innerHTML = "";
  schedule.forEach((task: Task, i: number) => {
    if (task.interval === "startup") return;
    const taskElem = document.createElement("div");
    taskElem.classList.add("mdc-card");
    const scheduled = new Date(task.lastExecuted + task.interval);
    taskElem.innerHTML = `
          <div class="task">
            <div class="taskDetails">
              <p>${task.name}</p>
              <p>${task.command}</p>
              <p>${scheduled.toLocaleString()}</p>
            </div>
            <div>
              <div class="mdc-touch-target-wrapper">
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="openLog(${i})">
                  <div class="mdc-fab__ripple"></div>
                  <span class="material-icons mdc-fab__icon">text_snippet</span>
                  <div class="mdc-fab__touch"></div>
                </button>
              </div>
              <div class="mdc-touch-target-wrapper">
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="deleteTask(${i})">
                  <div class="mdc-fab__ripple"></div>
                  <span class="material-icons mdc-fab__icon">delete</span>
                  <div class="mdc-fab__touch"></div>
                </button>
              </div>
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
    interval: parseInt(interval),
    description,
  });
  linearProgress.open();
});

(window as any).deleteTask = (index: number) => {
  ipcRenderer.send("delete-task", index);
  linearProgress.open();
};

(window as any).openLog = (index: number) => {
  ipcRenderer.send("open-log", index);
};

const commandInputElem = document.querySelector("#commandInput") as HTMLInputElement;
const browseButtonElem = document.querySelector("#browse") as HTMLButtonElement;
browseButtonElem.onclick = async (e) => {
  e.preventDefault();
  const response = await remote.dialog.showOpenDialog({ properties: ["openFile"] });
  commandInputElem.value = response.filePaths[0] || "";
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
  remote.getCurrentWindow().close();
});

ipcRenderer.send("get-schedule");
