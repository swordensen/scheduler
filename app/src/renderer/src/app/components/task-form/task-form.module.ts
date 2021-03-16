import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './task-form.component';



@NgModule({
  declarations: [TaskFormComponent],
  imports: [
    CommonModule
  ],
  exports: [TaskFormComponent]
})
export class TaskFormModule { }
