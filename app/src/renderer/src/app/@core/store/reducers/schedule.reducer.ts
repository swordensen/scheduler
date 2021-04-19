import { Action, createReducer, on } from '@ngrx/store';
import { setSchedule } from '../actions/schedule.actions';
import { Schedule } from '../../../../../../main/types';

const initialScheduleState: Schedule = [];

const _scheduleReducer = createReducer(
  initialScheduleState,
  on(setSchedule, (state, { schedule }) => schedule)
);

export function scheduleReducer(state: Schedule | undefined, action: Action) {
  return _scheduleReducer(state, action);
}
