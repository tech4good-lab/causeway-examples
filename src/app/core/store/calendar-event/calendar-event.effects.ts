import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of, Observable, throwError, forkJoin, from, pipe, merge } from 'rxjs';
import { switchMap, flatMap, mergeMap, map, catchError, tap, take } from 'rxjs/operators';
import { FirebaseService } from '../../firebase/firebase.service';
import { CachedLoadConnectionsService } from '../cached-load-connections.service';

import { CalendarEvent } from './calendar-event.model';
import { CalendarEventActionTypes, CalendarEventActions,
  StreamCalendarEvent, StreamCalendarEventSuccess, StreamCalendarEventFail,
  LoadCalendarEvent, LoadCalendarEventSuccess, LoadCalendarEventFail,
  AddCalendarEvent, AddCalendarEventSuccess, AddCalendarEventFail,
  UpdateCalendarEvent, UpdateCalendarEventSuccess, UpdateCalendarEventFail,
  UpsertCalendarEvent, UpsertCalendarEventSuccess, UpsertCalendarEventFail,
  RemoveCalendarEvent, RemoveCalendarEventSuccess, RemoveCalendarEventFail } from './calendar-event.actions';

@Injectable()
export class CalendarEventEffects {
  /** Process the stream action to create firebase connections. */
  stream$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<StreamCalendarEvent>(CalendarEventActionTypes.STREAM),
      mergeMap((action: StreamCalendarEvent) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new StreamCalendarEventSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new StreamCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the load action to create firebase connections. */
  load$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<LoadCalendarEvent>(CalendarEventActionTypes.LOAD),
      mergeMap((action: LoadCalendarEvent) => {
        const connection = this.clc.processLoadAction(action);
        return connection.loadStream.pipe(
          take(1),
          map(() => new LoadCalendarEventSuccess(action.queryParams, action.queryOptions, action.correlationId, action.followupActions)),
          catchError((error) => of(new LoadCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the add action to update database and initiate callbacks. */
  add$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<AddCalendarEvent>(CalendarEventActionTypes.ADD),
      mergeMap((action: AddCalendarEvent) => {
        return this.db.addEntity('calendarEvents', action.calendarEvent).pipe(
          mergeMap(() => merge(
            of(new AddCalendarEventSuccess(action.calendarEvent, action.correlationId)),
            this.actionsOnAdd(action),
          )),
          catchError((error) => of(new AddCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the update action to update database and initiate callbacks. */
  update$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpdateCalendarEvent>(CalendarEventActionTypes.UPDATE),
      mergeMap((action: UpdateCalendarEvent) => {
        return this.db.updateEntity('calendarEvents', action.__id, action.changes).pipe(
          mergeMap(() => merge(
            of(new UpdateCalendarEventSuccess(action.__id, action.changes, action.correlationId)),
            this.actionsOnUpdate(action),
          )),
          catchError((error) => of(new UpdateCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the upsert action to update database and initiate callbacks. */
  upsert$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<UpsertCalendarEvent>(CalendarEventActionTypes.UPSERT),
      mergeMap((action: UpsertCalendarEvent) => {
        return this.db.upsertEntity('calendarEvents', action.calendarEvent).pipe(
          mergeMap((results) => merge(
            of(new UpsertCalendarEventSuccess(action.calendarEvent, action.correlationId)),
            results.type === 'add' ? this.actionsOnAdd(new AddCalendarEvent(action.calendarEvent, action.correlationId)) : this.actionsOnUpdate(new UpdateCalendarEvent(action.calendarEvent.__id, action.calendarEvent, action.correlationId)),
          )),
          catchError((error) => of(new UpsertCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  /** Process the remove action to update database and initiate callbacks. */
  remove$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<RemoveCalendarEvent>(CalendarEventActionTypes.REMOVE),
      mergeMap((action: RemoveCalendarEvent) => {
        return this.db.removeEntity('calendarEvents', action.__id).pipe(
          mergeMap(() => merge(
            of(new RemoveCalendarEventSuccess(action.__id, action.correlationId)),
            this.actionsOnRemove(action),
          )),
          catchError((error) => of(new RemoveCalendarEventFail(error, action.correlationId))),
        );
      }),
    ),
  );

  actionsOnAdd(action: AddCalendarEvent): Observable<Action> {
    return EMPTY;
  }

  actionsOnUpdate(action: UpdateCalendarEvent): Observable<Action> {
    return EMPTY;
  }

  actionsOnRemove(action: RemoveCalendarEvent): Observable<Action> {
    return EMPTY;
  }

  constructor(
    private actions$: Actions,
    private db: FirebaseService,
    private clc: CachedLoadConnectionsService,
  ) {}
}
