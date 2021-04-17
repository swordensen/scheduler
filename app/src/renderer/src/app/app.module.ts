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
import { bullReducer, BullState } from './@core/store/reducers/bull.reducer';
import { APP_INITIALIZER } from '@angular/core';
import { BullListenerService } from './@core/services/bull-listener.service';
import { BullEffects } from './@core/store/effects/bull.effects';
export interface AppState {
  bull: BullState;
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HeaderModule,
    MainModule,
    StoreModule.forRoot({ bull: bullReducer }),
    EffectsModule.forRoot([ElectronEffects, BullEffects]),
  ],
  providers: [
    BullListenerService,
    {
      provide: APP_INITIALIZER,
      useFactory: (bs: BullListenerService) => () => bs.init(),
      deps: [BullListenerService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
