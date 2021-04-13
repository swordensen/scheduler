import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addJob,
  deleteJob,
  getRepeatableJobs,
  startJob,
} from '../actions/bull.actions';
import { filter, map, take, withLatestFrom } from 'rxjs/operators';
import { AppState } from 'src/app/app.module';
import { select, Store } from '@ngrx/store';
import { Action } from 'rxjs/internal/scheduler/Action';
import { selectJob } from '../selectors/bull.selectors';
import { ipcRenderer } from 'electron';

@Injectable()
export class BullEffects {
  constructor(private actions$: Actions, private store$: Store<AppState>) {}

  getRepeatableJobs$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(getRepeatableJobs),
        map(() => ipcRenderer.send('get-jobs'))
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
          ipcRenderer.send('add-job', {
            ...job,
            jobsOptions: {
              ...job.jobsOptions,
              // repeatable: null,
            },
          });
        })
      ),
    { dispatch: false }
  );

  startJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startJob),
        map(({ job }) => {
          ipcRenderer.send('start-job', job);
        })
      ),
    { dispatch: false }
  );

  deleteJob$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteJob),
        map(({ job }) => {
          ipcRenderer.send('remove-job', job);
        })
      ),
    { dispatch: false }
  );
}
