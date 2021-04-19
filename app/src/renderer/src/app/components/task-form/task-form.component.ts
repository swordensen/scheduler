import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addPathToTaskFormCommand,
  addTask,
  updateTaskFormCommand,
  updateTaskFormDescription,
  updateTaskFormInterval,
  updateTaskFormName,
} from 'src/app/@core/store/actions/schedule.actions';

import { remote } from 'electron';
import {
  selectTaskFormCommand,
  selectTaskFormDescription,
  selectTaskFormInterval,
  selectTaskFormName,
} from 'src/app/@core/store/selectors/taskForm.schedule';
import { TaskForm } from 'src/app/@core/store/reducers/taskForm.reducer';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent {
  intervalOptions = [
    {
      display: '10 seconds',
      value: 10000,
    },
    {
      display: 'every minute',
      value: 60000,
    },
    {
      display: 'daily',
      value: 86400000,
    },
    {
      display: 'weekly',
      value: 604800000,
    },
    {
      display: 'monthly',
      value: 2592000000,
    },
  ];

  command$ = this.store.select(selectTaskFormCommand);
  name$ = this.store.select(selectTaskFormName);
  interval$ = this.store.select(selectTaskFormInterval);
  description$ = this.store.select(selectTaskFormDescription);

  constructor(private store: Store<{ taskForm: TaskForm }>) {}

  async browse() {
    const dialogResponse = await remote.dialog.showOpenDialog({
      properties: ['openFile', 'showHiddenFiles'],
    });
    const path = dialogResponse.filePaths[0];
    this.store.dispatch(addPathToTaskFormCommand({ path }));
  }

  create() {
    this.store.dispatch(addTask());
  }

  updateName(name: string) {
    this.store.dispatch(updateTaskFormName({ name }));
  }

  updateDescription(description: string) {
    this.store.dispatch(updateTaskFormDescription({ description }));
  }

  updateTask(command: string) {
    this.store.dispatch(updateTaskFormCommand({ command }));
  }

  updateInterval(interval: string) {
    this.store.dispatch(updateTaskFormInterval({ interval }));
  }
}
