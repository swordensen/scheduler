import { createReducer, on, Action } from '@ngrx/store';
import { Task } from '../../../../../../main/types';
import {
  addPathToTaskFormCommand,
  updateTaskForm,
  updateTaskFormCommand,
  updateTaskFormDescription,
  updateTaskFormInterval,
  updateTaskFormName,
} from '../actions/schedule.actions';

const initialTaskFormState: Partial<Task> = {
  name: '',
  description: '',
  arguments: [''],
  command: '',
  cron: '',
  interval: '',
};

const _taskFormReducer = createReducer(
  initialTaskFormState,
  on(updateTaskForm, (state, { taskForm }) => ({
    ...state,
    ...taskForm,
  })),
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

export function taskFormReducer(
  state: Partial<Task> | undefined,
  action: Action
) {
  return _taskFormReducer(state, action);
}
