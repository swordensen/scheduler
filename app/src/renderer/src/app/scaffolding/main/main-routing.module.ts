import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
        {
            path: '',
            loadChildren: ()=> import('../../components/task-form/task-form.module').then(m => m.TaskFormModule)
        },
        {
            path: 'details/:id',
            loadChildren: () => import('../../components/task-details/task-details.module').then(m => m.TaskDetailsModule)
        }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }