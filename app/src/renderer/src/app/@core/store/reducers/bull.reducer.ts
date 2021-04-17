import { Action, createReducer, on } from '@ngrx/store';
import {
  updateTaskFormName,
  updateTaskFormDescription,
  setSchedule,
  updateTaskFormCommand,
  addPathToTaskFormCommand,
  updateTaskFormInterval,
} from '../actions/schedule.actions';
import { Schedule } from '../../../../../../main/types';
export interface BullState {
  schedule: Schedule;
  taskForm: {
    name?: string;
    description?: string;
    command?: string;
    interval?: string;
  };
}

const initialBullState: BullState = {
  schedule: [],
  taskForm: {},
};

const _bullReducer = createReducer(
  initialBullState,
  on(setSchedule, (state, { schedule }) => ({
    ...state,
    schedule,
  })),

  on(updateTaskFormName, (state, { name }) => ({
    ...state,
    taskForm: {
      ...state.taskForm,
      name,
    },
  })),
  on(updateTaskFormDescription, (state, { description }) => ({
    ...state,
    taskForm: {
      ...state.taskForm,
      description,
    },
  })),
  on(updateTaskFormCommand, (state, { command }) => ({
    ...state,
    taskForm: {
      ...state.taskForm,
      command,
    },
  })),
  on(addPathToTaskFormCommand, (state, { path }) => ({
    ...state,
    taskForm: {
      ...state.taskForm,
      command: path
        ? `${state.taskForm.command || ''} ${path}`
        : state.taskForm.command || '',
    },
  })),
  on(updateTaskFormInterval, (state, { interval }) => ({
    ...state,
    taskForm: {
      ...state.taskForm,
      interval,
    },
  }))
);

export function bullReducer(state: BullState | undefined, action: Action) {
  return _bullReducer(state, action);
}
