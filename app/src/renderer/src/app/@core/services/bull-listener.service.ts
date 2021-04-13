import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { MyJobData, MyJobJson } from '../../../../../main/types';
import {
  addJob,
  addJobToList,
  deleteJob,
  setRepeatableJobs,
  updateJobState,
} from '../store/actions/bull.actions';

@Injectable({
  providedIn: 'root',
})
export class BullListenerService {
  constructor(private store: Store) {}

  init() {
    console.log('bull listeners initialized');
    this.registerGetRepeatableJobsListener();
    this.registerRemoveJobListener();
    this.registerAddJobListener();
    this.registerStatusUpdateListener();
  }

  registerGetRepeatableJobsListener() {
    ipcRenderer.on('schedule', (event: any, repeatableJobs: any) => {
      console.log(repeatableJobs);
      this.store.dispatch(setRepeatableJobs({ repeatableJobs }));
    });
  }

  registerRemoveJobListener() {
    ipcRenderer.on('remove-job', (event: any, jobData: MyJobData) => {
      this.store.dispatch(deleteJob({ job: jobData }));
    });
  }

  registerAddJobListener() {
    ipcRenderer.on('add-job', (event: any, jobData: MyJobData) => {
      this.store.dispatch(addJobToList({ job: jobData }));
    });
  }

  registerStatusUpdateListener() {
    ipcRenderer.on('update-job-status', (event: any, { name, status }) => {
      console.log(name, status);
      this.store.dispatch(updateJobState({ name, status }));
    });
  }
}
