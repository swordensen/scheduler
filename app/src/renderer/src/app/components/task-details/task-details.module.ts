import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskDetailsComponent } from './task-details.component';
import {MatTabsModule} from '@angular/material/tabs';
import { TaskDetailsRoutingModule } from './task-details-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TaskDetailsComponent
  ],
  imports: [
    TaskDetailsRoutingModule,
    CommonModule,
    MatTabsModule,
    RouterModule,
  ],
  exports: [
    TaskDetailsComponent
  ]
})
export class TaskDetailsModule { }
