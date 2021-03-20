import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { setRepeatableJobs } from '../store/actions/bull.actions';
const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root',
})
export class BullListenerService {
  constructor(private store: Store) {}

  init() {
    console.log('bull listeners initialized');
  }

  registerGetRepeatableJobsListener() {
    electron.ipcRenderer.on('schedule', (event: any, repeatableJobs: any) => {
      console.log('repeatable jobs', repeatableJobs);
      this.store.dispatch(setRepeatableJobs({ repeatableJobs }));
    });
  }
}
