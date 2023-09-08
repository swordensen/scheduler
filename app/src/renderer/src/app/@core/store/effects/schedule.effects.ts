import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import {
  deleteTask,
  deleteTaskGroup,
  getSchedule,
  openLogFile,
  startTask,
  stopTask,
} from '../actions/schedule.actions';
import {
  DELETE_TASK_EVENT,
  DELETE_TASK_GROUP_EVENT,
  GET_SCHEDULE_EVENT,
  OPEN_TASK_LOG_FILE_EVENT,
  START_TASK_EVENT,
  STOP_TASK_EVENT,
} from '../../../../../../event-names';
import { Schedule } from '../../../../../../main/types';
import { startLoading, stopLoading } from '../actions/gui.actions';

@Injectable()
export class ScheduleEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{ schedule: Schedule }>
  ) {}

  getSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSchedule),
        map(() => {
          ipcRenderer.send(GET_SCHEDULE_EVENT);
          this.store$.dispatch(stopLoading());
        })
      ),
    { dispatch: false }
  );

  startTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startTask),
        map(({ task }) => {
          ipcRenderer.send(START_TASK_EVENT, task);
          this.store$.dispatch(startLoading());
        })
      ),
    { dispatch: false }
  );

  stopTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(stopTask),
        map(({ task }) => {
          ipcRenderer.send(STOP_TASK_EVENT, task);
          this.store$.dispatch(stopLoading());
        })
      ),
    { dispatch: false }
  );

  deleteTaskOrGroup$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteTask, deleteTaskGroup),
        map((data) => {
          if(data.type === '[Schedule] Delete Job'){
            ipcRenderer.send(DELETE_TASK_EVENT, data.task);
          } else if(data.type === '[Schedule] Delete Task Group'){
            ipcRenderer.send(DELETE_TASK_EVENT, data.taskGroup);
          }
          this.store$.dispatch(startLoading());
        })
      ),
    { dispatch: false }
  );

  openLogFile$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openLogFile),
        map(({ task }) => {
          ipcRenderer.send(OPEN_TASK_LOG_FILE_EVENT, task);
        })
      ),
    { dispatch: false }
  );
}
