import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';
import { EntitySelectorService } from '../../../core/store/app.selectors';

import { Observable, of, combineLatest } from 'rxjs';
import { bufferTime, distinctUntilChanged, shareReplay, mergeMap, filter, switchMap, map } from 'rxjs/operators';
import { User } from '../../../core/store/user/user.model';
import { LongTermData } from './page.model';

@Injectable({
  providedIn: 'root',
})
export class PageSelectors {
  constructor(private slRx: EntitySelectorService) {}

  /** Select the long term data. */
  //selectLongTermData(longTermData$: Observable<LongTermData[]>, currentUser$: Observable<User>, cId: string): Observable<LongTermData[]> {
  selectLongTermData(currentUser$: Observable<User>, cId: string): Observable<LongTermData[]> {
    return combineLatest(currentUser$).pipe(
      switchMap(([currentUser]) => {
        return this.slRx.selectLongTermGoals<LongTermData>([['__id', '==', currentUser.__id]], cId);
      }),
    );
  }

  /** Release memoized selectors. */
  cleanup(cId: string) {
    this.slRx.release(cId);
  }
}
