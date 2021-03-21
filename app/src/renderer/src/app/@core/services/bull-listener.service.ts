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
  }

  registerGetRepeatableJobsListener() {
    ipcRenderer.on('schedule', (event: any, repeatableJobs: any) =>
      this.store.dispatch(setRepeatableJobs({ repeatableJobs }))
    );
  }
}
