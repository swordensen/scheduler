import { createAction, props } from '@ngrx/store';

export const getRepeatableJobs = createAction('[Bull] get repeatable jobs');
export const setRepeatableJobs = createAction(
  '[Bull] set repeatable jobs',
  props<{ repeatableJobs: any[] }>()
);
export const getJobByKey = createAction(
  '[Bull] get job by key',
  props<{ key: string }>()
);
