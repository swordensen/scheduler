import { createReducer, on, Action } from '@ngrx/store';
import {
  addPathToTaskFormCommand,
  updateTaskFormCommand,
  updateTaskFormDescription,
  updateTaskFormInterval,
  updateTaskFormName,
} from '../actions/schedule.actions';

export interface TaskForm {
  name?: string;
  description?: string;
  command?: string;
  interval?: string;
  cron?: string;
}

const initialTaskFormState: TaskForm = {};

const _taskFormReducer = createReducer(
  initialTaskFormState,
  on(updateTaskFormName, (state, { name }) => ({
    ...state,
    name,
  })),
  on(updateTaskFormDescription, (state, { description }) => ({
    ...state,
    description,
  })),
  on(updateTaskFormCommand, (state, { command }) => ({
    ...state,
    command,
  })),
  on(addPathToTaskFormCommand, (state, { path }) => ({
    ...state,
    command: path ? `${state.command || ''} ${path}` : state.command || '',
  })),
  on(updateTaskFormInterval, (state, { interval }) => ({
    ...state,
    interval,
  }))
);

export function taskFormReducer(state: TaskForm | undefined, action: Action) {
  return _taskFormReducer(state, action);
}
