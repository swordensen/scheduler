import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClockComponent } from 'src/app/components/clock/clock.component';
import { TerminalComponent } from 'src/app/components/terminal/terminal.component';

const routes: Routes = [
  {
    path: '',
    component: TerminalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class MainRoutingModule {}
