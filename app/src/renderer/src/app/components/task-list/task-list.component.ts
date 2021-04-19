import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getSchedule } from 'src/app/@core/store/actions/schedule.actions';
import { selectSchedule } from 'src/app/@core/store/selectors/schedule.selectors';
import { Schedule } from '../../../../../main/types';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  schedule$ = this.store.select(selectSchedule);

  constructor(private store: Store<{ schedule: Schedule }>) {}

  ngOnInit(): void {
    this.store.dispatch(getSchedule());
  }
}
