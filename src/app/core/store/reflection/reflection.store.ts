import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from '../app.store';
import { QueryParams, QueryOptions, AnyEntity } from '../app.model';
import { CachedListenersService } from '../../firebase/cached-listeners.service';
import { Timestamp, AggregateSpec, AggregateSpecData } from '@angular/fire/firestore';
import { Reflection } from './reflection.model';

export class LoadReflection extends EntityLoadQuery<Reflection> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: Reflection) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('reflections', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: Reflection) => EntityLoadQuery<AnyEntity>[]): LoadReflection {
    return new LoadReflection(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamReflection extends EntityStreamQuery<Reflection> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: Reflection) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('reflections', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: Reflection) => EntityStreamQuery<AnyEntity>[]): StreamReflection {
    return new StreamReflection(store, queryParams, queryOptions, streamQueries);
  }
}

export const ReflectionStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<Reflection>('reflection'),
);
