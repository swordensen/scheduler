import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TaskFormModule } from 'src/app/components/task-form/task-form.module';
import { TaskListModule } from 'src/app/components/task-list/task-list.module';
import { ResizableModule } from 'angular-resizable-element';
import { ClockModule } from 'src/app/components/clock/clock.module';
import { MainRoutingModule } from './main-routing.module';

@NgModule({
  
  declarations: [MainComponent],
  imports: [
    MainRoutingModule,
    CommonModule,
    MatSidenavModule,
    ClockModule,
    TaskFormModule,
    TaskListModule,
    ResizableModule
  ],
  exports: [MainComponent],
})
export class MainModule {}
