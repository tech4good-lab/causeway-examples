import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import { bufferTime, distinctUntilChanged, shareReplay, mergeMap, filter, switchMap, map } from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';  // ADDED
import { LongTermData } from './page.model';
//import { LongTermGoalService } from '../../../core/store/long-term-goal/long-term-goal.service';  // ADDED

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  constructor(private slRx: EntitySelectorService) {}


  /** Select the quarter data. */
  //selectQuarterData(longTermGoal$: Observable<LongTermGoal>, currentUser$: Observable<User>, cId: string): Observable<LongTermGoal> {
  //selectLongTermGoal(currentUser$: Observable<User>, cId: string): Observable<LongTermGoal[]> {
  //selectLongTermGoals(currentUser$: Observable<User>, cId: string): Observable<LongTermGoal[]> {
  selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermData> {
    /*
    return combineLatest(longTermGoal$, currentUser$).pipe(
      switchMap(([longTermGoal, currentUser]) => {
        return this.slRx.selectLongTermGoal<LongTermGoal>(currentUser.__id, cId);
      }),
    );
    */

    /*
    return currentUser$.pipe(
      switchMap((currentUser) => {
        // return this.slRx.selectLongTermGoal<LongTermGoal>(currentUser.__id, cId);
        return this.slRx.selectLongTermGoals<LongTermGoal>([['__id', '==', currentUser.__id]], cId);
      }),
    );
    */

    return combineLatest(currentUser$).pipe(
      switchMap(([currentUser]) => {
        //return this.slRx.selectLongTermGoal<LongTermData>(`${currentUser.__id}`, cId, (q) => ({
        return this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId, (q) => ({
          /*
          longTermGoals: this.slRx.selectLongTermGoals([
            //['__id', '==', q.__id],
            ['__id', '==', currentUser.__id],
          ], cId)
          */
          
          longTermGoals: this.slRx.selectLongTermGoals([
            ['__id', '==', currentUser.__id],
          ], cId).pipe(
            map(goals => {
              return goals;
            }),
          ),      
        }));
      }),
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
