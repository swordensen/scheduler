import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card.component';
import { MatCardModule } from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
@NgModule({
  declarations: [TaskCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  exports: [TaskCardComponent],
})
export class TaskCardModule {}
