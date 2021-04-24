import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import {
  startTask,
  deleteTask,
  updateTaskForm,
  openLogFile,
} from 'src/app/@core/store/actions/schedule.actions';
import { AdvancedTaskFormDialogueComponent } from 'src/app/dialogues/advanced-task-form-dialogue/advanced-task-form-dialogue.component';
import { Task } from '../../../../../main/types';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input() task: Task;
  constructor(private store: Store, public dialog: MatDialog) {}

  _startTask() {
    this.store.dispatch(startTask({ task: this.task }));
  }

  _deleteTask() {
    this.store.dispatch(deleteTask({ task: this.task }));
  }

  _openLogFile() {
    this.store.dispatch(openLogFile({ task: this.task }));
  }

  _editTask() {
    this.store.dispatch(updateTaskForm({ taskForm: this.task }));
    this.dialog.open(AdvancedTaskFormDialogueComponent);
  }
}
