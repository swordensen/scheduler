import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addJob, getRepeatableJobs } from '../actions/bull.actions';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { AppState } from 'src/app/app.module';
import { select, Store } from '@ngrx/store';
import { Action } from 'rxjs/internal/scheduler/Action';
import { selectJob } from '../selectors/bull.selectors';

const electron = (<any>window).require('electron');

@Injectable()
export class BullEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>) {}

  getRepeatableJobs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getRepeatableJobs),
        map(() => electron.ipcRenderer.send('get-jobs'))
      ),
    { dispatch: false }
  );

  addRepeatableJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addJob),
        withLatestFrom(this.store$, (action, state) => {
          return state.bull.jobForm;
        }),
        map((job) => {
          console.log(job);
          // electron.ipcRenderer.send('add-job', job);
        })
      ),
    { dispatch: false }
  );
}
