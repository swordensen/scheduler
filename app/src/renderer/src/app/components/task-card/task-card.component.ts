import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { deleteJob, startJob } from 'src/app/@core/store/actions/bull.actions';
import { MyJobData } from '../../../../../main/types';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() job: MyJobData;
  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log(this.job);
  }

  _startJob() {
    this.store.dispatch(startJob({ job: this.job }));
  }

  _deleteJob() {
    this.store.dispatch(deleteJob({ job: this.job }));
  }
}
