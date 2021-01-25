import { readFileSync } from "fs";
import { resolve } from "path";
import { Config, Schedule, Task } from "../../../src/types";
import { ScheduleFileManager } from "../../../src/scheduleFileManager";
import { MDCTextField } from "@material/textfield";
import { MDCTopAppBar } from "@material/top-app-bar";

import "./clock";

const configFile = readFileSync(resolve(process.cwd(), "config.json"), "utf8");

const config: Config = JSON.parse(configFile);

const scheduleFileManager = new ScheduleFileManager(config);

const schedule = scheduleFileManager.schedule;

const scheduleContainer = document.getElementById("schedule");

renderSchedule(schedule);

scheduleFileManager.onChange((schedule) => {
  renderSchedule(schedule);
});

function renderSchedule(schedule: Schedule) {
  if (!scheduleContainer) return;
  scheduleContainer.innerHTML = "";
  schedule.forEach((task) => {
    if (task.interval === "startup") return;
    const taskElem = document.createElement("div");
    taskElem.classList.add("mdc-card");
    const scheduled = new Date(task.lastExecuted + task.interval);
    console.log(task.lastExecuted + task.interval);
    taskElem.innerHTML = `
          <div class="task">
              <p>${task.name}</p>
              <p>${task.commandPath}</p>
              <p>${scheduled.toLocaleString()}</p>
            </div>
          `;
    scheduleContainer.append(taskElem);
  });
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
    scheduleFileManager.addTask(data);
  });
}
