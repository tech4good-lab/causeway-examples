import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { Week } from './week.model';
import { WeekActionTypes, WeekActions,
  StreamWeek, StreamWeekSuccess, StreamWeekFail,
  LoadWeek, LoadWeekSuccess, LoadWeekFail,
  AddWeek, AddWeekSuccess, AddWeekFail,
  UpdateWeek, UpdateWeekSuccess, UpdateWeekFail,
  UpsertWeek, UpsertWeekSuccess, UpsertWeekFail,
  RemoveWeek, RemoveWeekSuccess, RemoveWeekFail } from './week.actions';

@Injectable()
export class WeekEffects {
  /** Process the stream action to create firebase connections. */
  stream$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<StreamWeek>(WeekActionTypes.STREAM),
      mergeMap((action: StreamWeek) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new StreamWeekSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new StreamWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadWeek>(WeekActionTypes.LOAD),
      mergeMap((action: LoadWeek) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new LoadWeekSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new LoadWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<AddWeek>(WeekActionTypes.ADD),
      mergeMap((action: AddWeek) => {
        return this.db.addEntity('weeks', action.week).pipe(
          mergeMap(() => merge(
            of(new AddWeekSuccess(action.week, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new AddWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpdateWeek>(WeekActionTypes.UPDATE),
      mergeMap((action: UpdateWeek) => {
        return this.db.updateEntity('weeks', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new UpdateWeekSuccess(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new UpdateWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the upsert action to update database and initiate callbacks. */
  upsert$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpsertWeek>(WeekActionTypes.UPSERT),
      mergeMap((action: UpsertWeek) => {
        return this.db.upsertEntity('weeks', action.week).pipe(
          mergeMap((results) => merge(
            of(new UpsertWeekSuccess(action.week, action.correlationId)),
            results.type === 'add' ? this.actionsOnAdd(new AddWeek(action.week, action.correlationId)) : this.actionsOnUpdate(new UpdateWeek(action.week.__id, action.week, action.correlationId)),
          )),
          catchError((error) => of(new UpsertWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<RemoveWeek>(WeekActionTypes.REMOVE),
      mergeMap((action: RemoveWeek) => {
        return this.db.removeEntity('weeks', action.__id).pipe(
          mergeMap(() => merge(
            of(new RemoveWeekSuccess(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new RemoveWeekFail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: AddWeek): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: UpdateWeek): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: RemoveWeek): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}
