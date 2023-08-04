import { createReducer, on, Action } from '@ngrx/store';
import { Task } from '../../../../../../main/types';
import {
  addPathToTaskFormCommand,
  resetTaskForm,
  updateTaskForm,
  updateTaskFormCommand,
  updateTaskFormDescription,
  updateTaskFormName,
  updateTaskFormTrigger,
} from '../actions/schedule.actions';

export const initialTaskFormState: Partial<Task> = {
  name: '',
  description: '',
  arguments: [''],
  command: '',
  triggers: [
    {
      type: 'interval',
      value: 86400000,
      next: Date.now(),
    },
  ],
  spawnOptions:{
    shell: true
  }
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
  on(updateTaskFormTrigger, (state, { trigger, index }) => ({
    ...state,
    triggers: state.triggers?.map((_trigger, i) => {
      if (index === i) return trigger;
      return trigger;
    }),
  })),
  on(resetTaskForm, (state, data) => initialTaskFormState)
);

export function taskFormReducer(
  state: Partial<Task> | undefined,
  action: Action
) {
  return _taskFormReducer(state, action);
}
