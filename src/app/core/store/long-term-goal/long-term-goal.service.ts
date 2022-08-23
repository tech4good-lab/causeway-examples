import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { LongTermGoal } from './long-term-goal.model';

@Injectable({
  providedIn: 'root',
})
export class LongTermGoalService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a longTermGoal from the store. */
  public selectLongTermGoal = <T extends LongTermGoal>(
    id: string,
    correlationId: string,
    childrenFn?: (e: LongTermGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<LongTermGoal, T>('longTermGoal', id, correlationId, childrenFn);
  };

  /** Select longTermGoals from the store. */
  public selectLongTermGoals = <T extends LongTermGoal>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: LongTermGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<LongTermGoal, T>('longTermGoal', queryParams, correlationId, childrenFn);
  };

  /** Get a longTermGoal directly from the database. */
  public getLongTermGoal = <T extends LongTermGoal>(
    id: string,
    childrenFn?: (e: LongTermGoal) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<LongTermGoal, T>('longTermGoals', id, childrenFn);
  };

  /** Get longTermGoals directly from the database. */
  public getLongTermGoals = <T extends LongTermGoal>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: LongTermGoal) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<LongTermGoal, T>('longTermGoals', queryParams, queryOptions, childrenFn);
  };
}
