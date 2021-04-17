import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { Schedule } from '../../../../../main/types';
import { setSchedule } from '../store/actions/schedule.actions';

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
    ipcRenderer.on('schedule', (event: any, schedule: Schedule) => {
      this.store.dispatch(setSchedule({ schedule }));
    });
  }
}
