import { Action, createReducer, on } from '@ngrx/store';
import {
  setSchedule,
  taskAdded,
  taskDeleted,
  taskFailed,
  taskStarted,
  taskUpdated,
  taskWaiting,
} from '../actions/schedule.actions';
import { Schedule } from '../../../../../../main/types';

const initialScheduleState: Schedule = [];

const _scheduleReducer = createReducer(
  initialScheduleState,
  on(setSchedule, (state, { schedule }) => schedule),
  on(taskStarted, (state, { task }) =>
    state.map((_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskWaiting, (state, { task }) =>
    state.map((_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskFailed, (state, { task }) =>
    state.map((_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskAdded, (state, { task }) => [...state, task]),
  on(taskUpdated, (state, { task }) =>
    state.map((_task) => {
      if (_task.id === task.id) return task;
      return _task;
    })
  ),
  on(taskDeleted, (state, { task }) =>
    state.reduce((accumulator, _task) => {
      if (_task.id !== task.id) accumulator.push(_task);
      return accumulator;
    }, [] as Schedule)
  )
);

export function scheduleReducer(state: Schedule | undefined, action: Action) {
  return _scheduleReducer(state, action);
}
