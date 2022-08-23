import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { WeekGoal } from './week-goal.model';

@Injectable({
  providedIn: 'root',
})
export class WeekGoalService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a weekGoal from the store. */
  public selectWeekGoal = <T extends WeekGoal>(
    id: string,
    correlationId: string,
    childrenFn?: (e: WeekGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<WeekGoal, T>('weekGoal', id, correlationId, childrenFn);
  };

  /** Select weekGoals from the store. */
  public selectWeekGoals = <T extends WeekGoal>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: WeekGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<WeekGoal, T>('weekGoal', queryParams, correlationId, childrenFn);
  };

  /** Get a weekGoal directly from the database. */
  public getWeekGoal = <T extends WeekGoal>(
    id: string,
    childrenFn?: (e: WeekGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<WeekGoal, T>('weekGoals', id, childrenFn);
  };

  /** Get weekGoals directly from the database. */
  public getWeekGoals = <T extends WeekGoal>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: WeekGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<WeekGoal, T>('weekGoals', queryParams, queryOptions, childrenFn);
  };
}
