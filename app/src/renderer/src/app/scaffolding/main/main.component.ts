import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';
import { selectSideNavOpen } from 'src/app/@core/store/selectors/gui.selectors';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  sideNavOpened$ = this.store.select(selectSideNavOpen);
  constructor(private store: Store<{ gui: GUIState }>) {}
}
