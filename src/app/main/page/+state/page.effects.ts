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

@Injectable()
export class PageEffects {
  /** Load data. */
  loadData$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadData>(PageActionTypes.LOAD_DATA),
      mergeMap((action: LoadData) => {
        const loadId = action.correlationId;
        return [];
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
