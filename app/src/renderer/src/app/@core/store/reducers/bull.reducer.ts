import { Action, createReducer, on } from '@ngrx/store';
import { JobsOptions } from 'bullmq';
import {
  setRepeatableJobs,
  addJob,
  updateJobName,
  updateJobDescription,
  updateJobTask,
  updateJobInterval,
  addPathToJobTask,
} from '../actions/bull.actions';

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
  jobForm: {
    name?: string;
    data?: {
      description?: string;
      task?: string;
    };
    jobsOptions?: JobsOptions;
  };
}

const initialBullState: BullState = {
  repeatableJobs: [],
  jobForm: {},
};

const _bullReducer = createReducer(
  initialBullState,
  on(setRepeatableJobs, (state, { repeatableJobs }) => ({
    ...state,
    repeatableJobs,
  })),
  // on(addJob, (state) => ({
  //   ...state,
  //   jobForm: {},
  // })),
  on(updateJobName, (state, { name }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      name,
    },
  })),
  on(updateJobDescription, (state, { description }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      data: {
        ...state.jobForm.data,
        description,
      },
    },
  })),
  on(updateJobTask, (state, { task }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      data: {
        ...state.jobForm.data,
        task,
      },
    },
  })),
  on(addPathToJobTask, (state, { path }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      data: {
        ...state.jobForm.data,
        task: path
          ? `${state.jobForm.data?.task || ''} ${path}`
          : state.jobForm.data?.task || '',
      },
    },
  })),
  on(updateJobInterval, (state, { interval }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      jobsOptions: {
        ...state.jobForm.jobsOptions,
        repeat: {
          ...state.jobForm.jobsOptions?.repeat,
          every: interval,
        },
      },
    },
  }))
);

export function bullReducer(state: BullState | undefined, action: Action) {
  return _bullReducer(state, action);
}
