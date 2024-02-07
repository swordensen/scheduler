import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';
import { selectSideNavOpen } from 'src/app/@core/store/selectors/gui.selectors';
import { ResizeEvent } from 'angular-resizable-element/public-api';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  sideNavOpened$ 
  sideNavWidth = "300px";
  constructor(public router:Router, private store: Store<{ gui: GUIState }>) {
    this.sideNavOpened$ = store.select(selectSideNavOpen);
  }

  handleSideNavResize(event:ResizeEvent){
    this.sideNavWidth = event.rectangle.width + "px";
  }
}
