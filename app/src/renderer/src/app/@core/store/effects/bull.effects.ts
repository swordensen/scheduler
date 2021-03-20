import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { getRepeatableJobs } from '../actions/bull.actions';
import { map } from 'rxjs/operators';

const electron = (<any>window).require('electron');

@Injectable()
export class BullEffects {
  constructor(private actions$: Actions) {}

  getRepeatableJobs$ = this.actions$.pipe(
    ofType(getRepeatableJobs),
    map(() => electron.ipcRenderer.send('get-jobs'))
  );
}
