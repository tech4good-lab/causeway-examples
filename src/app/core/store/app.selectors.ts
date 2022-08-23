import { Injectable } from '@angular/core';
import { CachedSelectorsService } from './cached-selectors.service';

import { AuthSelectorsService } from './auth/auth.selectors';

// Entity Selectors
import { WeekGoalService } from './week-goal/week-goal.service';
import { WeekService } from './week/week.service';
import { CalendarEventService } from './calendar-event/calendar-event.service';
import { LongTermGoalService } from './long-term-goal/long-term-goal.service';
import { QuarterGoalService } from './quarter-goal/quarter-goal.service';
import { QuarterService } from './quarter/quarter.service';
import { UserService } from './user/user.service';

@Injectable({
  providedIn: 'root',
})
export class EntitySelectorService {
  constructor(
    private cachedSelectors: CachedSelectorsService,
    private auth: AuthSelectorsService,
    // Entity Selectors
    private weekGoal: WeekGoalService,
    private week: WeekService,
    private calendarEvent: CalendarEventService,
    private longTermGoal: LongTermGoalService,
    private quarterGoal: QuarterGoalService,
    private quarter: QuarterService,
    private user: UserService
  ) {}

  public createId = this.cachedSelectors.createId;
  public release = this.cachedSelectors.release;

  public selectAuthUser = this.auth.selectAuthUser;

  // Entity Selectors
  public getWeekGoal = this.weekGoal.getWeekGoal;
  public getWeekGoals = this.weekGoal.getWeekGoals;
  public selectWeekGoal = this.weekGoal.selectWeekGoal;
  public selectWeekGoals = this.weekGoal.selectWeekGoals;
  public getWeek = this.week.getWeek;
  public getWeeks = this.week.getWeeks;
  public selectWeek = this.week.selectWeek;
  public selectWeeks = this.week.selectWeeks;
  public getCalendarEvent = this.calendarEvent.getCalendarEvent;
  public getCalendarEvents = this.calendarEvent.getCalendarEvents;
  public selectCalendarEvent = this.calendarEvent.selectCalendarEvent;
  public selectCalendarEvents = this.calendarEvent.selectCalendarEvents;
  public getLongTermGoal = this.longTermGoal.getLongTermGoal;
  public getLongTermGoals = this.longTermGoal.getLongTermGoals;
  public selectLongTermGoal = this.longTermGoal.selectLongTermGoal;
  public selectLongTermGoals = this.longTermGoal.selectLongTermGoals;
  public getQuarterGoal = this.quarterGoal.getQuarterGoal;
  public getQuarterGoals = this.quarterGoal.getQuarterGoals;
  public selectQuarterGoal = this.quarterGoal.selectQuarterGoal;
  public selectQuarterGoals = this.quarterGoal.selectQuarterGoals;
  public getQuarter = this.quarter.getQuarter;
  public getQuarters = this.quarter.getQuarters;
  public selectQuarter = this.quarter.selectQuarter;
  public selectQuarters = this.quarter.selectQuarters;
  public selectUser = this.user.selectUser;
  public selectUsers = this.user.selectUsers;
}
