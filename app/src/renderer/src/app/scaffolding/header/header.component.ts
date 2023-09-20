import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  maximizeWindow,
  minimizeWindow,
} from 'src/app/@core/store/actions/electron.actions';
import { toggleSideNav } from 'src/app/@core/store/actions/gui.actions';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';
import { selectLoading } from 'src/app/@core/store/selectors/gui.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  loading$ 
  constructor(private store: Store<{ gui: GUIState }>) {
    this.loading$ = this.store.select(selectLoading);
  }

  minimize() {
    this.store.dispatch(minimizeWindow());
  }

  maximize() {
    this.store.dispatch(maximizeWindow());
  }

  close() {
    this.store.dispatch(minimizeWindow());
  }

  _toggleSideNav() {
    this.store.dispatch(toggleSideNav());
  }
}
