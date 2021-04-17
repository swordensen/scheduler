import { createAction, props } from '@ngrx/store';
import { Schedule, Task } from '../../../../../../main/types';

export const getSchedule = createAction('[Schedule] get schedule');
export const setSchedule = createAction(
  '[Schedule] set schedule',
  props<{ schedule: Schedule }>()
);

export const addTask = createAction('[Schedule] add task');

export const updateTaskFormName = createAction(
  '[Schedule] update job name',
  props<{ name: string }>()
);

export const updateTaskFormDescription = createAction(
  '[Schedule] update task description',
  props<{ description: string }>()
);

export const updateTaskFormCommand = createAction(
  '[Schedule] Update Task ',
  props<{ command: string }>()
);

export const addPathToTaskFormCommand = createAction(
  '[Schedule] Add Path to job task',
  props<{ path: string }>()
);

export const updateTaskFormInterval = createAction(
  '[Schedule] update job interval',
  props<{ interval: string }>()
);

export const startTask = createAction(
  '[Schedule] Start Job',
  props<{ task: Task }>()
);

export const deleteTask = createAction(
  '[Schedule] Delete Job',
  props<{ task: Task }>()
);

export const updateTaskState = createAction(
  '[Schedule] Update Task State',
  props<{ name: string; status: string }>()
);