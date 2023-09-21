import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleClock } from 'src/app/@core/store/actions/gui.actions';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';
import { selectIsClockAnalog } from 'src/app/@core/store/selectors/gui.selectors';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {
  isClockAnalog$ = this.store.select(selectIsClockAnalog);

  constructor(private store:Store<{gui:GUIState}>){

  }

  toggleClock(){
    console.log('toggle clock triggered');
    this.store.dispatch(toggleClock());
  }
}
