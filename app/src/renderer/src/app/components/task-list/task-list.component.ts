import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getSchedule } from 'src/app/@core/store/actions/schedule.actions';
import { BullState } from 'src/app/@core/store/reducers/bull.reducer';
import { selectSchedule } from 'src/app/@core/store/selectors/bull.selectors';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  schedule$ = this.store.select(selectSchedule);

  constructor(private store: Store<{ bull: BullState }>) {}

  ngOnInit(): void {
    this.store.dispatch(getSchedule());
  }
}
