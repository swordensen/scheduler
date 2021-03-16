import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ClockModule } from 'src/app/components/clock/clock.module';
import { TaskFormModule } from 'src/app/components/task-form/task-form.module';
import { TaskListModule } from 'src/app/components/task-list/task-list.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    ClockModule,
    TaskFormModule,
    TaskListModule,
  ],
  exports: [MainComponent],
})
export class MainModule {}
