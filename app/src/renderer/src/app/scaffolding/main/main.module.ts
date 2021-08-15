import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ClockModule } from 'src/app/components/clock/clock.module';
import { TaskFormModule } from 'src/app/components/task-form/task-form.module';
import { TaskListModule } from 'src/app/components/task-list/task-list.module';
import { MainRoutingModule } from './main-routing.module';
import { TerminalModule } from 'src/app/components/terminal/terminal.module';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    ClockModule,
    TaskFormModule,
    TaskListModule,
    MainRoutingModule,
    TerminalModule,
  ],
  exports: [MainComponent],
})
export class MainModule {}
