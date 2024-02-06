import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskCardComponent } from './task-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AdvancedTaskFormDialogueModule } from 'src/app/dialogues/advanced-task-form-dialogue/advanced-task-form-dialogue.module';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [TaskCardComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AdvancedTaskFormDialogueModule,
    RouterModule
  ],
  exports: [TaskCardComponent],
})
export class TaskCardModule {}
