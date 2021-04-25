import { createAction, props } from '@ngrx/store';
import { Schedule, Task } from '../../../../../../main/types';

export const getSchedule = createAction('[Schedule] get schedule');
export const setSchedule = createAction(
  '[Schedule] set schedule',
  props<{ schedule: Schedule }>()
);

export const addTask = createAction('[Schedule] add task');

export const updateTaskForm = createAction(
  '[TaskForm] Update Task Form',
  props<{ taskForm: Partial<Task> }>()
);

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

export const openLogFile = createAction(
  '[Schedule] Open task log file',
  props<{ task: Task }>()
);

export const taskStarted = createAction(
  '[Schedule] Task started',
  props<{ task: Task }>()
);

export const taskWaiting = createAction(
  '[Schedule] Task Waiting',
  props<{ task: Task }>()
);

export const taskFailed = createAction(
  '[Schedule] Task Failed',
  props<{ task: Task }>()
);

export const taskAdded = createAction(
  '[Schedule] Task Added',
  props<{ task: Task }>()
);

export const taskUpdated = createAction(
  '[Schedule] Task Updated',
  props<{ task: Task }>()
);

export const taskDeleted = createAction(
  '[Schedule] Task Deleted',
  props<{ task: Task }>()
);
