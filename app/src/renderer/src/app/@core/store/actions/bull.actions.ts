import { createAction, props } from '@ngrx/store';
import { JobsOptions } from '../../../../../../../node_modules/bullmq';
export const getRepeatableJobs = createAction('[Bull] get repeatable jobs');
export const setRepeatableJobs = createAction(
  '[Bull] set repeatable jobs',
  props<{ repeatableJobs: any[] }>()
);
export const getJobByKey = createAction(
  '[Bull] get job by key',
  props<{ key: string }>()
);

export const addJob = createAction('[Bull] add repeatable job');

export const updateJobName = createAction(
  '[Bull] update job name',
  props<{ name: string }>()
);

export const updateJobDescription = createAction(
  '[Bull] update job description',
  props<{ description: string }>()
);

export const updateJobTask = createAction(
  '[Bull] Update job task',
  props<{ task: string }>()
);

export const addPathToJobTask = createAction(
  '[Bull] Add Path to job task',
  props<{ path: string }>()
);

export const updateJobInterval = createAction(
  '[Bull] update job interval',
  props<{ interval: number }>()
);
