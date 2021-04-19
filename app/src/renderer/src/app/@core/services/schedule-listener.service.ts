import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { Schedule } from '../../../../../main/types';
import { setSchedule } from '../store/actions/schedule.actions';
import { SEND_SCHEDULE_EVENT } from '../../../../../event-names';
import { stopLoading } from '../store/actions/gui.actions';
@Injectable({
  providedIn: 'root',
})
export class ScheduleListenerService {
  constructor(private store: Store) {}

  init() {
    this.registerScheduleListener();
  }

  registerScheduleListener() {
    ipcRenderer.on(SEND_SCHEDULE_EVENT, (event: any, schedule: Schedule) => {
      this.store.dispatch(setSchedule({ schedule }));
      this.store.dispatch(stopLoading());
    });
  }
}
