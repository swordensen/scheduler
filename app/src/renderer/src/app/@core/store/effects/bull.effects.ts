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

@Injectable()
export class BullEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>) {}

  getRepeatableJobs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getSchedule),
        map(() => ipcRenderer.send('get-jobs'))
      ),
    { dispatch: false }
  );

  addRepeatableJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTask),
        withLatestFrom(this.store$, (action, state) => {
          return state.bull.taskForm;
        }),
        map((task) => {
          ipcRenderer.send('add-job', task);
        })
      ),
    { dispatch: false }
  );

  startJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startTask),
        map(({ task }) => {
          ipcRenderer.send('start-job', task);
        })
      ),
    { dispatch: false }
  );

  deleteJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteTask),
        map(({ task }) => {
          ipcRenderer.send('remove-job', task);
        })
      ),
    { dispatch: false }
  );
}
