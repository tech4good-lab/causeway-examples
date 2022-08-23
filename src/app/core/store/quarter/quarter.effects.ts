import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { Quarter } from './quarter.model';
import { QuarterActionTypes, QuarterActions,
  StreamQuarter, StreamQuarterSuccess, StreamQuarterFail,
  LoadQuarter, LoadQuarterSuccess, LoadQuarterFail,
  AddQuarter, AddQuarterSuccess, AddQuarterFail,
  UpdateQuarter, UpdateQuarterSuccess, UpdateQuarterFail,
  RemoveQuarter, RemoveQuarterSuccess, RemoveQuarterFail } from './quarter.actions';

@Injectable()
export class QuarterEffects {
  /** Process the stream action to create firebase connections. */
  stream$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<StreamQuarter>(QuarterActionTypes.STREAM),
      mergeMap((action: StreamQuarter) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new StreamQuarterSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new StreamQuarterFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadQuarter>(QuarterActionTypes.LOAD),
      mergeMap((action: LoadQuarter) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new LoadQuarterSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new LoadQuarterFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<AddQuarter>(QuarterActionTypes.ADD),
      mergeMap((action: AddQuarter) => {
        return this.db.addEntity('quarters', action.quarter).pipe(
          mergeMap(() => merge(
            of(new AddQuarterSuccess(action.quarter, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new AddQuarterFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpdateQuarter>(QuarterActionTypes.UPDATE),
      mergeMap((action: UpdateQuarter) => {
        return this.db.updateEntity('quarters', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new UpdateQuarterSuccess(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new UpdateQuarterFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<RemoveQuarter>(QuarterActionTypes.REMOVE),
      mergeMap((action: RemoveQuarter) => {
        return this.db.removeEntity('quarters', action.__id).pipe(
          mergeMap(() => merge(
            of(new RemoveQuarterSuccess(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new RemoveQuarterFail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: AddQuarter): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: UpdateQuarter): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: RemoveQuarter): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}
