import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { Schedule, Task } from '../../../../../main/types';
import {
  setSchedule,
  taskAdded,
  taskDeleted,
  taskFailed,
  taskStarted,
  taskUpdated,
  taskWaiting,
} from '../store/actions/schedule.actions';
import {
  SEND_SCHEDULE_EVENT,
  TASK_ADDED_EVENT,
  TASK_DELETED_EVENT,
  TASK_FAILED_EVENT,
  TASK_STARTED_EVENT,
  TASK_UPDATED_EVENT,
  TASK_WAITING_EVENT,
} from '../../../../../event-names';
import { stopLoading } from '../store/actions/gui.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class ScheduleListenerService {
  constructor(
    private store: Store,
    private _snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  init() {
    this.registerScheduleListener();
  }

  openSnackBar(message: string) {
    this.zone.run(() => {
      const snackBar = this._snackBar.open(message, 'OK', {
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
      snackBar.onAction().subscribe(() => {
        snackBar.dismiss();
      });
    });
  }

  registerScheduleListener() {
    ipcRenderer.on(SEND_SCHEDULE_EVENT, (event: any, schedule: Schedule) => {
      this.store.dispatch(setSchedule({ schedule }));
      this.store.dispatch(stopLoading());
    });

    ipcRenderer.on(TASK_ADDED_EVENT, (event: any, task: Task) => {
      this.store.dispatch(taskAdded({ task }));
      this.openSnackBar(`task: ${task.name} added to the schedule`);
    });

    ipcRenderer.on(TASK_DELETED_EVENT, (event: any, task: Task) => {
      this.store.dispatch(taskDeleted({ task }));
      this.openSnackBar(`task: ${task.name} removed from the schedule`);
    });

    ipcRenderer.on(TASK_UPDATED_EVENT, (event: any, task: Task) => {
      this.store.dispatch(taskUpdated({ task }));
      this.openSnackBar(`task: ${task.name} has been updated`);
    });

    ipcRenderer.on(TASK_STARTED_EVENT, (event: any, task: Task) => {
      this.store.dispatch(taskStarted({ task }));
      this.openSnackBar(`task: ${task.name} has started`);
    });

    ipcRenderer.on(TASK_FAILED_EVENT, (event: any, task: Task) => {
      this.store.dispatch(taskFailed({ task }));
      this.openSnackBar(`task: ${task.name} has failed`);
    });

    ipcRenderer.on(TASK_WAITING_EVENT, (even: any, task: Task) => {
      this.store.dispatch(taskWaiting({ task }));
      this.openSnackBar(`task: ${task.name} has completed`);
    });
  }

  
}
