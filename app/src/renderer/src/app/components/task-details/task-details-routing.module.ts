import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaskDetailsComponent } from './task-details.component';


const routes: Routes = [
  {
    path: '',
    component: TaskDetailsComponent,
    children: [
        {
            path: '',
            redirectTo: 'details',
        },
        {
            path: 'details',
            loadChildren: () => import('../../components/task-form/task-form.module').then(m => m.TaskFormModule)
        },
        {
            path: 'logs',
            loadChildren: () => import('../../components/task-logs/task-logs.module').then(m => m.TaskLogsModule)
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskDetailsRoutingModule { }