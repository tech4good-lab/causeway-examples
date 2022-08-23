import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

import * as fromAuth from './auth/auth.reducer';

// Entity Reducers
import * as fromWeekGoal from './week-goal/week-goal.reducer';
import * as fromWeek from './week/week.reducer';
import * as fromCalendarEvent from './calendar-event/calendar-event.reducer';
import * as fromLongTermGoal from './long-term-goal/long-term-goal.reducer';
import * as fromQuarterGoal from './quarter-goal/quarter-goal.reducer';
import * as fromQuarter from './quarter/quarter.reducer';
import * as fromUser from './user/user.reducer';

export interface State {
  router: RouterReducerState;
  auth: fromAuth.State;
  // Entity State
  weekGoal: fromWeekGoal.State;
  week: fromWeek.State;
  calendarEvent: fromCalendarEvent.State;
  longTermGoal: fromLongTermGoal.State;
  quarterGoal: fromQuarterGoal.State;
  quarter: fromQuarter.State;
  user: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  auth: fromAuth.reducer,
  // Entity Reducers
  weekGoal: fromWeekGoal.reducer,
  week: fromWeek.reducer,
  calendarEvent: fromCalendarEvent.reducer,
  longTermGoal: fromLongTermGoal.reducer,
  quarterGoal: fromQuarterGoal.reducer,
  quarter: fromQuarter.reducer,
  user: fromUser.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];
