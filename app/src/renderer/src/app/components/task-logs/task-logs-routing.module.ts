import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskLogsComponent } from './task-logs.component';



const routes: Routes = [
  {
    path: '',
    component: TaskLogsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskLogsRoutingModule { }