import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  startTask,
  deleteTask,
  updateTaskForm,
  openLogFile,
  stopTask,
} from 'src/app/@core/store/actions/schedule.actions';
import { AdvancedTaskFormDialogueComponent } from 'src/app/dialogues/advanced-task-form-dialogue/advanced-task-form-dialogue.component';
import { Task } from '../../../../../main/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input() task: Task;

  get next() {
    let next: number | string = 0;
    this.task.triggers?.forEach((trigger) => {
      if (trigger.type === 'CRON' || trigger.type === 'interval') {
        if(typeof next === 'string') next = parseInt(next);
        next = next > trigger.next ? next : trigger.next;
      }
    });
    return next;
  }

  get hasStartupTrigger() {
    return this.task.triggers?.some((trigger) => trigger.type === 'startup');
  }
  constructor(private router:Router, private store: Store, public dialog: MatDialog) {}

  _startTask(event: any) {
    event.stopPropagation();
    this.store.dispatch(startTask({ task: this.task }));
  }

  _stopTask(event: any) {
    event.stopPropagation();
    if (this.task.status === 'active')
      this.store.dispatch(stopTask({ task: this.task }));
  }

  _deleteTask() {
    this.store.dispatch(deleteTask({ task: this.task }));
  }

  _openLogFile() {
    this.store.dispatch(openLogFile({ task: this.task }));
  }

  _editTask() {
    this.store.dispatch(updateTaskForm({ taskForm: this.task }));
    this.router.navigate(['details',this.task.id])
  }
}
