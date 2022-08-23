import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { QuarterGoal } from './quarter-goal.model';

@Injectable({
  providedIn: 'root',
})
export class QuarterGoalService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a quarterGoal from the store. */
  public selectQuarterGoal = <T extends QuarterGoal>(
    id: string,
    correlationId: string,
    childrenFn?: (e: QuarterGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<QuarterGoal, T>('quarterGoal', id, correlationId, childrenFn);
  };

  /** Select quarterGoals from the store. */
  public selectQuarterGoals = <T extends QuarterGoal>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: QuarterGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<QuarterGoal, T>('quarterGoal', queryParams, correlationId, childrenFn);
  };

  /** Get a quarterGoal directly from the database. */
  public getQuarterGoal = <T extends QuarterGoal>(
    id: string,
    childrenFn?: (e: QuarterGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<QuarterGoal, T>('quarterGoals', id, childrenFn);
  };

  /** Get quarterGoals directly from the database. */
  public getQuarterGoals = <T extends QuarterGoal>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: QuarterGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<QuarterGoal, T>('quarterGoals', queryParams, queryOptions, childrenFn);
  };
}
