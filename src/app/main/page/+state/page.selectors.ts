import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import { bufferTime, distinctUntilChanged, shareReplay, mergeMap, filter, switchMap, map } from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';
import { LongTermData } from './page.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  constructor(private slRx: EntitySelectorService) {}


  /** Select the long term goal data. */
  selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermGoal> {
  //selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermData[]> { 
  //selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermData> {  // ORIGINAL

    /* ORIGINAL (Doesn't work. See reasons below)
    return currentUser$.pipe(
      switchMap((currentUser) => {
        return this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId);
      }),
    );
    */

    return currentUser$.pipe(
      switchMap((currentUser) => {
        console.log('currentUser.__id', currentUser.__id);

        // # 1
        /*
        let toReturn = this.slRx.selectLongTermGoals<LongTermData>([['__id', '==', currentUser.__id]], cId).pipe(
          map((longTermDataArr) => {
            console.log('Hello World!');

            // Shows up as an empty array.
            // So nothing is getting selected. Do we have to input first?
            console.log('The toReturn:', longTermDataArr);

            console.log('The toReturn:', longTermDataArr[0]); // Shows up as undefined (Since longTermDataArr is an empty array)
            return longTermDataArr[0];
          })
        );
        */

        // # 2    Same as 1, but just getting a LongTermGoal Observable instead of LongTermData
        /*
        let toReturn = this.slRx.selectLongTermGoals([['__id', '==', currentUser.__id]], cId).pipe(
          map((longTermDataArr) => {
            console.log('Hello World!');

            // Shows up as an empty array.
            // So nothing is getting selected. Do we have to input first?
            console.log('The toReturn:', longTermDataArr);

            console.log('The toReturn:', longTermDataArr[0]); // Shows up as undefined (Since longTermDataArr is an empty array)
            return longTermDataArr[0];
          })
        );
        */

        // # 3    The stuff inside map doesn't get executed.
        // Reason: Because nothing is selected
        /*
        let toReturn = this.slRx.selectLongTermGoal(currentUser.__id, cId).pipe(
          map((toReturn) => {
            console.log('Hello World');
            console.log('The toReturn:', toReturn);
            return toReturn;
          })
        );
        */

        /*  # 4  and  # 5
        //let toReturn = this.slRx.selectLongTermGoal(currentUser.__id, cId);  // Change return type above to Observable<LongTermGoal> if using this one
        let toReturn = this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId);
        
        if(toReturn) {
          console.log('toReturn is NOT null'); // THIS SHOWS UP
          console.log('toReturn: ', toReturn);   
          
          toReturn.pipe(map((toReturn) => {
              console.log('shows in console');  // These don't show up. Read somewhere that it doesn't work with map and that tap should be used instead.
              console.log('toReturn.__id', toReturn.__id);
              console.log('toReturn.oneYear', toReturn.oneYear);
              console.log('toReturn.fiveYear', toReturn.fiveYear);
            })
          );
           
          toReturn.pipe(tap(toReturn => {
            console.log('shows in console');  // Still doesn't show up
            })
          );
          
        } else {
          console.log('toReturn is null');
        }

        return toReturn;
        */

        //return this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId);

        /*
        let toReturn = this.slRx.selectLongTermGoals<LongTermData>([['__id', '==', currentUser.__id]], cId, (goal) => ({
          //__id: this.slRx.selectLongTermGoal(goal.__id, cId),
          oneYear: this.slRx.selectLongTermGoal(goal.__id, cId).pipe(
            map((longTermGoal) => {
              return longTermGoal.oneYear;
            })
          ),
          fiveYear: this.slRx.selectLongTermGoal(goal.__id, cId).pipe(
            map((longTermGoal) => {
              return longTermGoal.fiveYear;
            })
          ),
        })).pipe(
          map((longTermDataArr) => {
            return longTermDataArr[0];
          })
        );
        */

        //let toReturn = this.slRx.selectLongTermGoals<LongTermData>([['__id', '==', currentUser.__id]], cId).pipe(
        let toReturn = this.slRx.selectLongTermGoals([['__id', '==', currentUser.__id]], cId).pipe(
          //switchMap((longTermGoalArr) => {
          map((longTermGoalArr) => {
            let theLongTermGoal = longTermGoalArr[0];
            //return this.slRx.selectLongTermGoal<LongTermData>(theLongTermData.__id, cId);  // If using switchMap
            return theLongTermGoal;  // If using map
          })
        );

        return toReturn;
        
      }),
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
