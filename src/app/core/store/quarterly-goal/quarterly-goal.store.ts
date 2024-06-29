import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from '../app.store';
import { QueryParams, QueryOptions, AnyEntity } from '../app.model';
import { CachedListenersService } from '../../firebase/cached-listeners.service';
import { Timestamp, AggregateSpec, AggregateSpecData } from '@angular/fire/firestore';
import { QuarterlyGoal } from './quarterly-goal.model';

export class LoadQuarterlyGoal extends EntityLoadQuery<QuarterlyGoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: QuarterlyGoal) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('quarterlyGoals', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: QuarterlyGoal) => EntityLoadQuery<AnyEntity>[]): LoadQuarterlyGoal {
    return new LoadQuarterlyGoal(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamQuarterlyGoal extends EntityStreamQuery<QuarterlyGoal> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: QuarterlyGoal) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('quarterlyGoals', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: QuarterlyGoal) => EntityStreamQuery<AnyEntity>[]): StreamQuarterlyGoal {
    return new StreamQuarterlyGoal(store, queryParams, queryOptions, streamQueries);
  }
}

export const QuarterlyGoalStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<QuarterlyGoal>('quarterlyGoals'),
);
