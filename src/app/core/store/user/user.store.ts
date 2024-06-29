import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries, withEntitiesAndDBMethods } from '../app.store';
import { QueryParams, QueryOptions, AnyEntity } from '../app.model';
import { CachedListenersService } from '../../firebase/cached-listeners.service';
import { Timestamp, AggregateSpec, AggregateSpecData } from '@angular/fire/firestore';
import { User } from '../user/user.model';

export class LoadUser extends EntityLoadQuery<User> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: User) => EntityLoadQuery<AnyEntity>[],
  ) {
    super('users', store, queryParams, queryOptions, loadQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, loadQueries?: (entity: User) => EntityLoadQuery<AnyEntity>[]): LoadUser {
    return new LoadUser(store, queryParams, queryOptions, loadQueries);
  }
}

export class StreamUser extends EntityStreamQuery<User> {
  constructor(
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: User) => EntityStreamQuery<AnyEntity>[],
  ) {
    super('users', store, queryParams, queryOptions, streamQueries);
  }

  static create(store, queryParams: QueryParams, queryOptions: QueryOptions, streamQueries?: (entity: User) => EntityStreamQuery<AnyEntity>[]): StreamUser {
    return new StreamUser(store, queryParams, queryOptions, streamQueries);
  }
}

export const UserStore = signalStore(
  { providedIn: 'root' },
  withEntitiesAndDBMethods<User>('users'),
);
