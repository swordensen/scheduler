import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { map, withLatestFrom } from 'rxjs/operators';
import { ADD_TASK_EVENT } from '../../../../../../event-names';
import { Task } from '../../../../../../main/types';
import { startLoading } from '../actions/gui.actions';
import {
  addTask,
  resetTaskForm,
  updateTaskForm,
} from '../actions/schedule.actions';

@Injectable()
export class TaskFormEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{ taskForm: Partial<Task> }>
  ) {}

  addTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTask),
        withLatestFrom(this.store$, (action, state) => {
          return state.taskForm;
        }),
        map((task) => {
          console.log(task);
          ipcRenderer.send(ADD_TASK_EVENT, task);
          this.store$.dispatch(resetTaskForm());
          this.store$.dispatch(startLoading());
        })
      ),
    { dispatch: false }
  );
}
