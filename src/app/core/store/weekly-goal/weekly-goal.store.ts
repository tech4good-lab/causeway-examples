import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from '../app.store';
import { QueryParams, QueryOptions, AnyEntity } from '../app.model';
import { CachedListenersService } from '../../firebase/cached-listeners.service';
import { Timestamp, AggregateSpec, AggregateSpecData } from '@angular/fire/firestore';
import { WeeklyGoal } from './weekly-goal.model';

export class LoadWeeklyGoal extends EntityLoadQuery<WeeklyGoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: WeeklyGoal) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('weeklyGoals', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: WeeklyGoal) => EntityLoadQuery<AnyEntity>[]): LoadWeeklyGoal {
    return new LoadWeeklyGoal(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamWeeklyGoal extends EntityStreamQuery<WeeklyGoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: WeeklyGoal) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('weeklyGoals', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: WeeklyGoal) => EntityStreamQuery<AnyEntity>[]): StreamWeeklyGoal {
    return new StreamWeeklyGoal(store, queryParams, queryOptions, streamQueries);
  }
}

export const WeeklyGoalStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<WeeklyGoal>('weeklyGoals'),
);
