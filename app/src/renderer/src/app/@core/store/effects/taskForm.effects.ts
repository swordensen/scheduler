import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { ipcRenderer } from 'electron';
import { map, withLatestFrom } from 'rxjs/operators';
import { ADD_TASK_EVENT } from '../../../../../../event-names';
import { Schedule, Task } from '../../../../../../main/types';
import { startLoading } from '../actions/gui.actions';
import {
  addTask,
  resetTaskForm,
  saveTask,
  updateTaskForm,
} from '../actions/schedule.actions';
import { UPDATE_TASK_EVENT } from '../../../../../../event-names';

@Injectable()
export class TaskFormEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{ 
      taskForm: Partial<Task>,
      schedule: Schedule
     }>
  ) {}

  addTask$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addTask),
        withLatestFrom(this.store$, (action, state) => {
          return {
            task: state.taskForm,
            taskGroup: state.schedule
          };
        }),
        map(({task, taskGroup}) => {
          ipcRenderer.send(ADD_TASK_EVENT, {task,taskGroup});
          this.store$.dispatch(resetTaskForm());
          this.store$.dispatch(startLoading());
        })
      ),
    { dispatch: false }
  );

  saveTask$ = createEffect(
    () => 
      this.actions$.pipe(
        ofType(saveTask),
        withLatestFrom(this.store$, (action, state)=> {
          return state.taskForm
        }),
        map((task)=> {
          ipcRenderer.send(UPDATE_TASK_EVENT, task);
          this.store$.dispatch(startLoading());
        })
      ),
      {
        dispatch: false
      }
  )
}
