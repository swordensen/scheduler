import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';



@NgModule({
  declarations: [TaskListComponent],
  imports: [
    CommonModule
  ],
  exports: [TaskListComponent]
})
export class TaskListModule { }
