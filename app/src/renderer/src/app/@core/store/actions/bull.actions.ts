import { createAction, props } from '@ngrx/store';
import { JobJson, JobsOptions } from '../../../../../../../node_modules/bullmq';
import { MyJobData, MyJobJson } from '../../../../../../main/types';
export const getRepeatableJobs = createAction('[Bull] get repeatable jobs');
export const setRepeatableJobs = createAction(
  '[Bull] set repeatable jobs',
  props<{ repeatableJobs: MyJobData[] }>()
);
export const getJobByKey = createAction(
  '[Bull] get job by key',
  props<{ key: string }>()
);

export const addJob = createAction('[Bull] add repeatable job');

export const addJobToList = createAction(
  '[Bull] add job to list',
  props<{ job: MyJobData }>()
);

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

export const startJob = createAction(
  '[Bull] Start Job',
  props<{ job: MyJobData }>()
);

export const deleteJob = createAction(
  '[Bull] Delete Job',
  props<{ job: MyJobData }>()
);

export const updateJobState = createAction(
  '[Bull] Update Job State',
  props<{ name: string; status: string }>()
);
