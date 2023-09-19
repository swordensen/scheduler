import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';
import { selectSideNavOpen } from 'src/app/@core/store/selectors/gui.selectors';
import { ResizeEvent } from 'angular-resizable-element/public-api';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  sideNavOpened$ = this.store.select(selectSideNavOpen);
  sideNavWidth = "300px";
  constructor(private store: Store<{ gui: GUIState }>) {}

  handleSideNavResize(event:ResizeEvent){
    console.log(event);
    this.sideNavWidth = event.rectangle.width + "px";
  }
}
