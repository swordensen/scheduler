import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getSchedule } from 'src/app/@core/store/actions/schedule.actions';
import { selectSchedule } from 'src/app/@core/store/selectors/schedule.selectors';
import { Schedule } from '../../../../../main/types';
import { setFilter } from 'src/app/@core/store/actions/gui.actions';
import { selectFilter } from 'src/app/@core/store/selectors/gui.selectors';
import { GUIState } from 'src/app/@core/store/reducers/gui.reducer';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  schedule$ 

  constructor(private store: Store<{ schedule: Schedule, gui:GUIState }>) {
    this.schedule$ = this.store.select(selectSchedule);
  }

  ngOnInit(): void {
    this.store.dispatch(getSchedule());
  }

  onKey(event:KeyboardEvent){
    const value = (event.target as HTMLInputElement).value
    this.store.dispatch(setFilter({filter:value}))
  }
}
