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


  /** Select the quarter data. */
  selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermData> {
    /*
    return currentUser$.pipe(
      switchMap((currentUser) => {
        return this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId).pipe(
          switchMap((longTermData) => {
            return [longTermData];
          })
        );
      }),
    );
    */

    console.log('cId', cId);

    return currentUser$.pipe(
      switchMap((currentUser) => {
        console.log('currentUser.__id: ', currentUser.__id);

        /*
        this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId).pipe(
          map((longTermData) => {
            console.log('I got here');
            console.log('longTermData.__id: ', longTermData.__id);
            console.log('longTermData.oneYear: ', longTermData.oneYear);
            console.log('longTermData.fiveYear: ', longTermData.fiveYear);
          })
        );
        */

        /*
        let toReturn = this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId);

        if(toReturn) {
          console.log('toReturn is not null');  // Shows up
          //console.log('toReturn: ', toReturn);

          console.log('toReturn.__id: ', toReturn.pipe(
            map((toReturn) => {
              return toReturn.__id;
            })
          ));
          console.log('toReturn.oneYear: ', toReturn.pipe(
            map((toReturn) => {
              return toReturn.oneYear;
            })
          ));
          console.log('toReturn.fiveYear: ', toReturn.pipe(
            map((toReturn) => {
              return toReturn.fiveYear;
            })
          ));
        } else {
          console.log('toReturn is NULL');
        }
        */

        /*
        this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId).pipe(
          tap(longTermData =>
            console.log('longTermData.__id: ', longTermData.__id), // Doesn't show anything
          )
        );
        */

        return this.slRx.selectLongTermGoal<LongTermData>(currentUser.__id, cId);
      }),
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
