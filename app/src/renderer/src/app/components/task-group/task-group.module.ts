import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskGroupComponent } from './task-group.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { TaskCardModule } from '../task-card/task-card.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    TaskGroupComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    TaskCardModule,
    MatIconModule,
    MatDialogModule,
    MatMenuModule,
    MatButtonModule
  ],
  exports:[
    TaskGroupComponent
  ]
})
export class TaskGroupModule { }
