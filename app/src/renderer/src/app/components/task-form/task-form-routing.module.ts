import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskFormComponent } from './task-form.component';


const routes: Routes = [
  {
    path: '',
    component: TaskFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskFormRoutingModule { }