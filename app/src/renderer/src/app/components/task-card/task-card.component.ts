import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { JobJson, JobsOptions } from 'bullmq';
import { startJob } from 'src/app/@core/store/actions/bull.actions';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent implements OnInit {
  @Input() job: JobJson;
  constructor(private store: Store) {}

  ngOnInit(): void {
    console.log(this.job);
  }

  _startJob(jobId: string) {
    this.store.dispatch(startJob({ jobId }));
  }
}
