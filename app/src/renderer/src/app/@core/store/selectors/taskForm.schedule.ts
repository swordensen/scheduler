import { Task } from '../../../../../../main/types';

export const selectTaskForm = (state: { taskForm: Partial<Task> }) =>
  state.taskForm;

export const selectTaskFormName = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.name;

export const selectTaskFormCommand = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.command;

export const selectTaskFormDescription = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.description;

export const selectTaskFormTriggers = (state: { taskForm: Partial<Task> }) =>
  state.taskForm.triggers;

export const selectFirstTaskFormTriggerType = (state: {
  taskForm: Partial<Task>;
}) => (state.taskForm.triggers ? state.taskForm.triggers[0].type : null);
