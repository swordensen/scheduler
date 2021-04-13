import { AppState } from 'src/app/app.module';
import { BullState } from '../reducers/bull.reducer';

export const selectRepeatableJobs = (state: AppState) =>
  state.bull.repeatableJobs;

export const selectJob = (state: AppState) => state.bull.jobForm;

export const selectJobName = (state: AppState) => state.bull.jobForm.data?.name;

export const selectJobTask = (state: AppState) => state.bull.jobForm.data?.task;

export const selectJobDescription = (state: AppState) =>
  state.bull.jobForm.data?.description;

export const selectJobInterval = (state: AppState) =>
  state.bull.jobForm.jobsOptions?.repeat?.every;
