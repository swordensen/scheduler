import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { setRepeatableJobs } from '../store/actions/bull.actions';

@Injectable({
  providedIn: 'root',
})
export class BullListenerService {
  constructor(private store: Store) {}

  init() {
    console.log('bull listeners initialized');
    this.registerGetRepeatableJobsListener();
  }

  registerGetRepeatableJobsListener() {
    ipcRenderer.on('schedule', (event: any, repeatableJobs: any) => {
      console.log(repeatableJobs);
      this.store.dispatch(setRepeatableJobs({ repeatableJobs }));
    });
  }
}
