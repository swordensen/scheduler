import { AppState } from 'src/app/app.module';
import { BullState } from '../reducers/bull.reducer';

export const selectRepeatableJobs = (state: AppState) =>
  state.bull.repeatableJobs;
