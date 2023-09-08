import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedTaskFormComponent } from './advanced-task-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CronStrModule } from 'src/app/pipes/cron-str/cron-str.module';

@NgModule({
  declarations: [AdvancedTaskFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    CronStrModule,
  ],
  exports: [AdvancedTaskFormComponent],
})
export class AdvancedTaskFormModule {}
