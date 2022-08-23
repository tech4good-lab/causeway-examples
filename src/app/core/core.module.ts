import { NgModule, Optional, SkipSelf, NgZone, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { throwIfAlreadyLoaded } from './setup/module-import-guard';

import { environment } from '../../environments/environment';

// NgRx
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, metaReducers } from './store/app.reducer';
import { AppEffects } from './store/app.effects';

// Auth
import { AuthEffects } from './store/auth/auth.effects';

// Service Effects
import { SnackbarEffects } from './snackbar/snackbar.effects';

// Entity Effects
import { WeekGoalEffects } from './store/week-goal/week-goal.effects';
import { WeekEffects } from './store/week/week.effects';
import { CalendarEventEffects } from './store/calendar-event/calendar-event.effects';
import { LongTermGoalEffects } from './store/long-term-goal/long-term-goal.effects';
import { QuarterGoalEffects } from './store/quarter-goal/quarter-goal.effects';
import { QuarterEffects } from './store/quarter/quarter.effects';
import { UserEffects } from './store/user/user.effects';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictActionImmutability: false,
      },
    }),
    StoreRouterConnectingModule.forRoot({ routerState: RouterState.Minimal }),
    EffectsModule.forRoot([
      AppEffects,
      AuthEffects,
      // Service Effects
      SnackbarEffects,
      // Entity Effects
      WeekGoalEffects,
      WeekEffects,
      CalendarEventEffects,
      LongTermGoalEffects,
      QuarterGoalEffects,
      QuarterEffects,
      UserEffects,
    ]),
  ],
  declarations: [],
  exports: [],
  providers: [],
})
export class CoreModule { 
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
