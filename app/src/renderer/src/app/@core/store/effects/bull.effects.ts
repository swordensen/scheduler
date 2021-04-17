import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map, withLatestFrom } from 'rxjs/operators';
import { AppState } from 'src/app/app.module';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import {
  addTask,
  deleteTask,
  getSchedule,
  startTask,
} from '../actions/schedule.actions';
import {
  ADD_TASK_EVENT,
  DELETE_TASK_EVENT,
  GET_SCHEDULE_EVENT,
  START_TASK_EVENT,
} from '../../../../../../event-names';

@Injectable()
export class BullEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>) {}

  getSchedule$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSchedule),
        map(() => ipcRenderer.send(GET_SCHEDULE_EVENT))
      ),
    { dispatch: false }
  );

  addTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTask),
        withLatestFrom(this.store$, (action, state) => {
          return state.bull.taskForm;
        }),
        map((task) => {
          console.log(`adding task ${task.name}`);
          ipcRenderer.send(ADD_TASK_EVENT, task);
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
        })
      ),
    { dispatch: false }
  );

  deleteTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteTask),
        map(({ task }) => {
          ipcRenderer.send(DELETE_TASK_EVENT, task);
        })
      ),
    { dispatch: false }
  );
}
