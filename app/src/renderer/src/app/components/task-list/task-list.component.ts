import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getRepeatableJobs } from 'src/app/@core/store/actions/bull.actions';
import { BullState } from 'src/app/@core/store/reducers/bull.reducer';
import { selectRepeatableJobs } from 'src/app/@core/store/selectors/bull.selectors';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  repeatableJobs$ = this.store.select(selectRepeatableJobs);

  constructor(private store: Store<{ bull: BullState }>) {}

  ngOnInit(): void {
    this.store.dispatch(getRepeatableJobs());
  }
}
