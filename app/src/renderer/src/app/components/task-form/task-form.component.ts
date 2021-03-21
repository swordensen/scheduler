import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import {
  addJob,
  addPathToJobTask,
  updateJobDescription,
  updateJobInterval,
  updateJobName,
  updateJobTask,
} from 'src/app/@core/store/actions/bull.actions';
import {
  selectJobDescription,
  selectJobInterval,
  selectJobName,
  selectJobTask,
} from 'src/app/@core/store/selectors/bull.selectors';
import { AppState } from 'src/app/app.module';
import { remote } from 'electron';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit {
  intervalOptions = [
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

  task$ = this.store.select(selectJobTask);
  name$ = this.store.select(selectJobName);
  interval$ = this.store.select(selectJobInterval);
  description$ = this.store.select(selectJobDescription);

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    // this.store.subscribe((store) => {
    //   console.log(store);
    // });
  }

  async browse() {
    const dialogResponse = await remote.dialog.showOpenDialog({
      properties: ['openFile', 'showHiddenFiles'],
    });
    const path = dialogResponse.filePaths[0];
    this.store.dispatch(addPathToJobTask({ path }));
  }

  create() {
    this.store.dispatch(addJob());
  }

  updateName(name: string) {
    this.store.dispatch(updateJobName({ name }));
  }

  updateDescription(description: string) {
    this.store.dispatch(updateJobDescription({ description }));
  }

  updateTask(task: string) {
    this.store.dispatch(updateJobTask({ task }));
  }

  updateInterval(interval: string) {
    // turn into number
    const _interval = parseInt(interval);
    this.store.dispatch(updateJobInterval({ interval: _interval }));
  }
}
