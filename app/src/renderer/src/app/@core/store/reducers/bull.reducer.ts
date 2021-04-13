import { Action, createReducer, on } from '@ngrx/store';
import { JobsOptions } from 'bullmq';
import {
  setRepeatableJobs,
  updateJobName,
  updateJobDescription,
  updateJobTask,
  updateJobInterval,
  addPathToJobTask,
  deleteJob,
  updateJobState,
  addJobToList,
} from '../actions/bull.actions';
import { MyJobData, MyJobJson } from '../../../../../../main/types';
export interface BullState {
  repeatableJobs: MyJobData[];
  jobForm: {
    data?: {
      name?: string;
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

  on(updateJobName, (state, { name }) => ({
    ...state,
    jobForm: {
      ...state.jobForm,
      data: {
        ...state.jobForm.data,
        name,
      },
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
  })),
  on(deleteJob, (state, { job }) => ({
    ...state,
    repeatableJobs: state.repeatableJobs.reduce((acc, cur) => {
      if (cur.name !== job.name) acc.push(cur);
      return acc;
    }, [] as MyJobData[]),
  })),
  on(updateJobState, (state, { name, status }) => ({
    ...state,
    repeatableJobs: state.repeatableJobs.map((job) => {
      if (job.name === name) {
        return {
          ...job,
          status,
        };
      }
      return job;
    }),
  })),
  on(addJobToList, (state, { job }) => ({
    ...state,
    jobForm: {
      data: {
        name: '',
        description: '',
        task: '',
      },
    },
    repeatableJobs: [...state.repeatableJobs, job],
  }))
);

export function bullReducer(state: BullState | undefined, action: Action) {
  return _bullReducer(state, action);
}
