import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalogClockComponent } from './analog-clock.component';



@NgModule({
  declarations: [AnalogClockComponent],
  imports: [
    CommonModule
  ],
  exports: [AnalogClockComponent]
})
export class AnalogClockModule { }
