import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { LongTermGoal } from './long-term-goal.model';
import { LongTermGoalActionTypes, LongTermGoalActions,
  StreamLongTermGoal, StreamLongTermGoalSuccess, StreamLongTermGoalFail,
  LoadLongTermGoal, LoadLongTermGoalSuccess, LoadLongTermGoalFail,
  AddLongTermGoal, AddLongTermGoalSuccess, AddLongTermGoalFail,
  UpdateLongTermGoal, UpdateLongTermGoalSuccess, UpdateLongTermGoalFail,
  UpsertLongTermGoal, UpsertLongTermGoalSuccess, UpsertLongTermGoalFail,
  RemoveLongTermGoal, RemoveLongTermGoalSuccess, RemoveLongTermGoalFail } from './long-term-goal.actions';

@Injectable()
export class LongTermGoalEffects {
  /** Process the stream action to create firebase connections. */
  stream$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<StreamLongTermGoal>(LongTermGoalActionTypes.STREAM),
      mergeMap((action: StreamLongTermGoal) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new StreamLongTermGoalSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new StreamLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadLongTermGoal>(LongTermGoalActionTypes.LOAD),
      mergeMap((action: LoadLongTermGoal) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new LoadLongTermGoalSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new LoadLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<AddLongTermGoal>(LongTermGoalActionTypes.ADD),
      mergeMap((action: AddLongTermGoal) => {
        return this.db.addEntity('longTermGoals', action.longTermGoal).pipe(
          mergeMap(() => merge(
            of(new AddLongTermGoalSuccess(action.longTermGoal, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new AddLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpdateLongTermGoal>(LongTermGoalActionTypes.UPDATE),
      mergeMap((action: UpdateLongTermGoal) => {
        return this.db.updateEntity('longTermGoals', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new UpdateLongTermGoalSuccess(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new UpdateLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the upsert action to update database and initiate callbacks. */
  upsert$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpsertLongTermGoal>(LongTermGoalActionTypes.UPSERT),
      mergeMap((action: UpsertLongTermGoal) => {
        return this.db.upsertEntity('longTermGoals', action.longTermGoal).pipe(
          mergeMap((results) => merge(
            of(new UpsertLongTermGoalSuccess(action.longTermGoal, action.correlationId)),
            results.type === 'add' ? this.actionsOnAdd(new AddLongTermGoal(action.longTermGoal, action.correlationId)) : this.actionsOnUpdate(new UpdateLongTermGoal(action.longTermGoal.__id, action.longTermGoal, action.correlationId)),
          )),
          catchError((error) => of(new UpsertLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<RemoveLongTermGoal>(LongTermGoalActionTypes.REMOVE),
      mergeMap((action: RemoveLongTermGoal) => {
        return this.db.removeEntity('longTermGoals', action.__id).pipe(
          mergeMap(() => merge(
            of(new RemoveLongTermGoalSuccess(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new RemoveLongTermGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: AddLongTermGoal): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: UpdateLongTermGoal): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: RemoveLongTermGoal): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}
