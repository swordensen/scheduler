import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronStrPipe } from './cron-str.pipe';



@NgModule({
  declarations: [
    CronStrPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CronStrPipe
  ]
})
export class CronStrModule { }
