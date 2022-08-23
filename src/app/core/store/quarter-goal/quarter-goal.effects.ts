import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { QuarterGoal } from './quarter-goal.model';
import { QuarterGoalActionTypes, QuarterGoalActions,
  StreamQuarterGoal, StreamQuarterGoalSuccess, StreamQuarterGoalFail,
  LoadQuarterGoal, LoadQuarterGoalSuccess, LoadQuarterGoalFail,
  AddQuarterGoal, AddQuarterGoalSuccess, AddQuarterGoalFail,
  UpdateQuarterGoal, UpdateQuarterGoalSuccess, UpdateQuarterGoalFail,
  RemoveQuarterGoal, RemoveQuarterGoalSuccess, RemoveQuarterGoalFail } from './quarter-goal.actions';

@Injectable()
export class QuarterGoalEffects {
  /** Process the stream action to create firebase connections. */
  stream$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<StreamQuarterGoal>(QuarterGoalActionTypes.STREAM),
      mergeMap((action: StreamQuarterGoal) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new StreamQuarterGoalSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new StreamQuarterGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadQuarterGoal>(QuarterGoalActionTypes.LOAD),
      mergeMap((action: LoadQuarterGoal) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new LoadQuarterGoalSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new LoadQuarterGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<AddQuarterGoal>(QuarterGoalActionTypes.ADD),
      mergeMap((action: AddQuarterGoal) => {
        return this.db.addEntity('quarterGoals', action.quarterGoal).pipe(
          mergeMap(() => merge(
            of(new AddQuarterGoalSuccess(action.quarterGoal, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new AddQuarterGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpdateQuarterGoal>(QuarterGoalActionTypes.UPDATE),
      mergeMap((action: UpdateQuarterGoal) => {
        return this.db.updateEntity('quarterGoals', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new UpdateQuarterGoalSuccess(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new UpdateQuarterGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<RemoveQuarterGoal>(QuarterGoalActionTypes.REMOVE),
      mergeMap((action: RemoveQuarterGoal) => {
        return this.db.removeEntity('quarterGoals', action.__id).pipe(
          mergeMap(() => merge(
            of(new RemoveQuarterGoalSuccess(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new RemoveQuarterGoalFail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: AddQuarterGoal): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: UpdateQuarterGoal): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: RemoveQuarterGoal): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}
