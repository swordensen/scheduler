import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { minimizeWindow, maximizeWindow } from '../actions/electron.actions';
import { exhaustMap, map } from 'rxjs/operators';
import { remote } from 'electron';

@Injectable()
export class ElectronEffects {
  constructor(private actions$: Actions) {}

  minimize$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(minimizeWindow),
        map(() => remote.getCurrentWindow().minimize())
      ),
    { dispatch: false }
  );

  maximize$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(maximizeWindow),
        map(() => {
          const window = remote.getCurrentWindow();
          if (window.isMaximized()) {
            return window.restore();
          }
          return window.maximize();
        })
      ),
    { dispatch: false }
  );
}
