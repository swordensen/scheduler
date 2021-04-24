import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFormComponent } from './task-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
// import { MatDialogModule } from '@angular/material/dialog';
import { AdvancedTaskFormDialogueModule } from 'src/app/dialogues/advanced-task-form-dialogue/advanced-task-form-dialogue.module';
@NgModule({
  declarations: [TaskFormComponent],
  imports: [
    AdvancedTaskFormDialogueModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FlexLayoutModule,
    FormsModule,
  ],
  exports: [TaskFormComponent],
})
export class TaskFormModule {}
