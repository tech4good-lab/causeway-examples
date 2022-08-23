import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { of, Observable } from 'rxjs';
import { mergeMap, tap, map } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../core/store/app.reducer';

import { ActionFlow, RouterNavigate, LoadAction, Unsubscribe } from '../../../core/store/app.actions';
import { PageActionTypes, Cleanup, LoadData } from './page.actions';

import { StreamUser } from '../../../core/store/user/user.actions';
import { StreamQuarter } from '../../../core/store/quarter/quarter.actions';
import { StreamQuarterGoal } from '../../../core/store/quarter-goal/quarter-goal.actions';

@Injectable()
export class PageEffects {
  /** Load data. */
  loadData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadData>(PageActionTypes.LOAD_DATA),
      mergeMap((action: LoadData) => {
        const loadId = action.correlationId;
        const quarterId = `${action.payload.quarterStartTime}`;
        const currentUser = action.payload.currentUser;

        return [
          new StreamQuarter([['__id', '==', quarterId]], {}, loadId),
          new StreamQuarterGoal([['__userId', '==', currentUser.__id], ['__quarterId', '==', quarterId]], {}, loadId),
        ];
      })
    )
  );

  /** Unsubscribe connections from Firebase. */
  cleanup$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<Cleanup>(PageActionTypes.CLEANUP),
      map((action: Cleanup) => new Unsubscribe(action.correlationId))
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>
  ) {}
}
