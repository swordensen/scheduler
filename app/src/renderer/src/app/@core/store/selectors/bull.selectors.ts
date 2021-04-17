import { AppState } from 'src/app/app.module';

export const selectSchedule = (state: AppState) => state.bull.schedule;

export const selectTaskForm = (state: AppState) => state.bull.taskForm;

export const selectTaskFormName = (state: AppState) => state.bull.taskForm.name;

export const selectTaskFormCommand = (state: AppState) =>
  state.bull.taskForm.command;

export const selectTaskFormDescription = (state: AppState) =>
  state.bull.taskForm.description;

export const selectTaskFormInterval = (state: AppState) =>
  state.bull.taskForm.interval;
