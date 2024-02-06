import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { HeaderModule } from './scaffolding/header/header.module';
import { MainModule } from './scaffolding/main/main.module';
import { EffectsModule } from '@ngrx/effects';
import { ElectronEffects } from './@core/store/effects/electron.effects';
import { scheduleReducer } from './@core/store/reducers/schedule.reducer';
import { taskFormReducer } from './@core/store/reducers/taskForm.reducer';
import { APP_INITIALIZER } from '@angular/core';
import { ScheduleListenerService } from './@core/services/schedule-listener.service';
import { ScheduleEffects } from './@core/store/effects/schedule.effects';
import { TaskFormEffects } from './@core/store/effects/taskForm.effects';
import { Schedule } from '../../../main/types';
import { guiReducer } from './@core/store/reducers/gui.reducer';
import { Task } from 'electron';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
export interface AppState {
  schedule: Schedule;
  taskForm: Partial<Task>;
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderModule,
    MainModule,
    MatSnackBarModule,
    StoreModule.forRoot({
      schedule: scheduleReducer,
      taskForm: taskFormReducer,
      gui: guiReducer,
    }),
    EffectsModule.forRoot([ElectronEffects, ScheduleEffects, TaskFormEffects]),
  ],
  providers: [
    ScheduleListenerService,
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 2500 },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (bs: ScheduleListenerService) => () => bs.init(),
      deps: [ScheduleListenerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
