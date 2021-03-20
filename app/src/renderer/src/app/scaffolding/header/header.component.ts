import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  maximizeWindow,
  minimizeWindow,
} from 'src/app/@core/store/actions/electron.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private store: Store) {}

  minimize() {
    this.store.dispatch(minimizeWindow());
  }

  maximize() {
    this.store.dispatch(maximizeWindow());
  }

  close() {
    this.store.dispatch(minimizeWindow());
  }
}
