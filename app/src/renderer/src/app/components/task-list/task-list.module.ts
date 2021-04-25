import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskCardModule } from '../task-card/task-card.module';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [TaskListComponent],
  imports: [CommonModule, TaskCardModule, FlexLayoutModule],
  exports: [TaskListComponent],
})
export class TaskListModule {}
