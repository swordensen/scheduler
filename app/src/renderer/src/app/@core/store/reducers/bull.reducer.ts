import { Action, createReducer, on } from '@ngrx/store';
import { setRepeatableJobs } from '../actions/bull.actions';

export interface BullState {
  repeatableJobs: {
    key: string;
    name: string;
    id: string;
    endDate: number;
    tz: string;
    cron: string;
    next: number;
  }[];
  taskToAdd: {
    name: string;
    command: string;
    description: string;
    interval?: number;
    cron?: string;
  };
}

const initialBullState: BullState = {
  repeatableJobs: [],
  taskToAdd: {
    name: '',
    command: '',
    description: '',
  },
};

const _bullReducer = createReducer(
  initialBullState,
  on(setRepeatableJobs, (state, { repeatableJobs }) => ({
    ...state,
    repeatableJobs,
  }))
);

export function bullReducer(state: BullState | undefined, action: Action) {
  return _bullReducer(state, action);
}
