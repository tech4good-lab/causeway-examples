import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../app.reducer';
import * as fromAuth from './auth.reducer';
import { FirebaseService } from '../../firebase/firebase.service';
import { ActionFlow, RouterNavigate } from '../app.actions';

import {
  switchMap,
  mergeMap,
  map,
  catchError,
  tap,
  take,
  pluck,
} from 'rxjs/operators';
import { LOAD, LoadAuth, LoadedAuth } from './auth.actions';
import { User } from '../user/user.model';
import { UserActionTypes, AddUser, UpdateUser } from '../user/user.actions';

@Injectable()
export class AuthEffects {
  /** Process the load auth action. */
  LoadAuth$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<LoadAuth>(LOAD),
      switchMap(() => this.db.afUser().pipe(take(1))),
      mergeMap((afUser: any) => {
        if (afUser) {
          return this.db.queryObjValueChanges<User>('users', afUser.uid).pipe(
            map((user: User) => {
              if (user) {
                return new LoadedAuth({ user });
              } else {
                // If no entry in DB, make them login again to create an entry
                return new LoadedAuth({ user: undefined });
              }
            })
          );
        } else {
          return [new LoadedAuth({ user: undefined })];
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private router: Router,
    private db: FirebaseService
  ) {}
}
