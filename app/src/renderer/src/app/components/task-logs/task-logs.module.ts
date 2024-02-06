import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskLogsComponent } from './task-logs.component';
import { RouterModule } from '@angular/router';
import { TaskLogsRoutingModule } from './task-logs-routing.module';



@NgModule({
  declarations: [
    TaskLogsComponent
  ],
  imports: [
    TaskLogsRoutingModule,
    CommonModule,
    RouterModule
  ]
})
export class TaskLogsModule { }
