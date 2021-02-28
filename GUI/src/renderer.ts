import "./styles.scss";

import { Task } from "../../fileManager/src/types";
import { MDCTextField } from "@material/textfield";
import { MDCTopAppBar } from "@material/top-app-bar";
import { ipcRenderer, remote } from "electron";
import "./isSchedulerRunning";

import "./clock";
import { MDCLinearProgress } from "@material/linear-progress";

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
                <button class="mdc-fab mdc-fab--mini mdc-fab--touch" onclick="openLog(${JSON.stringify(task)})">
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
const taskElem = document.querySelector("#task");
if (taskElem) {
  const textField = new MDCTextField(taskElem);
}

const nameElem = document.querySelector("#name");
if (nameElem) {
  const textField = new MDCTextField(nameElem);
}

const intervalElem = document.querySelector("#interval");
if (intervalElem) {
  const textField = new MDCTextField(intervalElem);
}

const descriptionElem = document.querySelector("#description");
if (descriptionElem) {
  const textField = new MDCTextField(descriptionElem);
}

const topAppBarElement = document.querySelector(".mdc-top-app-bar");
if (topAppBarElement) {
  const topAppBar = new MDCTopAppBar(topAppBarElement);
}

const form = document.querySelector("#taskForm");
if (form) {
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form as HTMLFormElement);
    const data: any = Object.fromEntries(formData.entries());
    data.interval = parseInt(data.interval);
    ipcRenderer.send("add-task", data);
    linearProgress.open();
  });
}

(window as any).deleteTask = (index: number) => {
  ipcRenderer.send("delete-task", index);
  linearProgress.open();
};

(window as any).openLog = (taskString: string) => {
  ipcRenderer.send("open-log", JSON.parse(taskString));
};

const commandElem = document.querySelector("#command") as HTMLInputElement;
const browseButtonElem = document.querySelector("#browse") as HTMLButtonElement;
if (browseButtonElem) {
  browseButtonElem.onclick = async (e) => {
    e.preventDefault();
    const response = await remote.dialog.showOpenDialog({ properties: ["openFile"] });
    commandElem.value = response.filePaths[0] || "";
  };
}

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
