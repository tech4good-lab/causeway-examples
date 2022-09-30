import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import {
  bufferTime,
  distinctUntilChanged,
  shareReplay,
  mergeMap,
  filter,
  switchMap,
  map,
} from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';
import { QuarterData } from './page.model';

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  constructor(private slRx: EntitySelectorService) {}

  /** Select the quarter data. */
  selectQuarterData(
    quarterStartTime$: Observable<number>,
    currentUser$: Observable<User>,
    cId: string
  ): Observable<QuarterData> {
    return combineLatest(quarterStartTime$, currentUser$).pipe(
      switchMap(([quarterStartTime, currentUser]) => {
        return this.slRx.selectQuarter<QuarterData>(
          `${quarterStartTime}`,
          cId,
          (q) => ({
            quarterGoals: this.slRx
              .selectQuarterGoals(
                [
                  ['__userId', '==', currentUser.__id],
                  ['__quarterId', '==', q.__id],
                ],
                cId
              )
              .pipe(
                map((goals) => {
                  goals.sort((a, b) => a.order - b.order);
                  return goals;
                })
              ),
          })
        );
      })
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}


