import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClockComponent } from './clock.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DigitalClockModule } from '../digital-clock/digital-clock.module';
import { AnalogClockModule } from '../analog-clock/analog-clock.module';



@NgModule({
  declarations: [
    ClockComponent
  ],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    DigitalClockModule,
    AnalogClockModule
  ],
  exports: [
    ClockComponent
  ]
})
export class ClockModule { }
