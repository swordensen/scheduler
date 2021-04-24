import { Task } from '../../../../../../main/types';

export const selectTaskForm = (state: { taskForm: Partial<Task> }) =>
  state.taskForm;

export const selectTaskFormName = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.name;

export const selectTaskFormCommand = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.command;

export const selectTaskFormDescription = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.description;

export const selectTaskFormInterval = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.interval;
