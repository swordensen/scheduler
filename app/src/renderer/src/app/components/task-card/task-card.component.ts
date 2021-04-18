import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  startTask,
  deleteTask,
} from 'src/app/@core/store/actions/schedule.actions';
import { Task } from '../../../../../main/types';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task;
  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log(this.task);
  }

  _startTask() {
    this.store.dispatch(startTask({ task: this.task }));
  }

  _deleteTask() {
    this.store.dispatch(deleteTask({ task: this.task }));
  }
}
