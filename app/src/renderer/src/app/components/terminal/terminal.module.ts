import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TerminalComponent } from './terminal.component';
import { BlinkerComponent } from './components/blinker/blinker.component';

@NgModule({
  declarations: [TerminalComponent, BlinkerComponent],
  imports: [BrowserModule],
  exports: [TerminalComponent],
})
export class TerminalModule {}
