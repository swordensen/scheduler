import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskCardModule } from '../task-card/task-card.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskGroupModule } from '../task-group/task-group.module';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, TaskCardModule, MatFormFieldModule, MatInputModule, TaskGroupModule],
  exports: [TaskListComponent],
})
export class TaskListModule {}
