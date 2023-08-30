import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskCardModule } from '../task-card/task-card.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, TaskCardModule, MatFormFieldModule, MatInputModule],
  exports: [TaskListComponent],
})
export class TaskListModule {}
