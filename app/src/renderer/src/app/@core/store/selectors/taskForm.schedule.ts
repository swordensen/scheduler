import { TaskForm } from '../reducers/taskForm.reducer';

export const selectTaskForm = (state: { taskForm: TaskForm }) => state.taskForm;

export const selectTaskFormName = (state: { taskForm: TaskForm }) =>
  state.taskForm.name;

export const selectTaskFormCommand = (state: { taskForm: TaskForm }) =>
  state.taskForm.command;

export const selectTaskFormDescription = (state: { taskForm: TaskForm }) =>
  state.taskForm.description;

export const selectTaskFormInterval = (state: { taskForm: TaskForm }) =>
  state.taskForm.interval;
