import { inject, effect, WritableSignal } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { withEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, selectEntities, processLoadQueries } from '../app.store';
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
  withEntities<User>(),
  withMethods((store) => ({
    selectEntity(id: string): User {
      return store.entityMap()[id];
    },
    selectFirst(queryParams: QueryParams, queryOptions: QueryOptions): User {
      const entities = selectEntities<User>(store.entityMap(), queryParams, queryOptions);
      if (entities && entities.length > 0) {
        return entities[0];
      } else {
        return undefined;
      }
    },
    selectEntities(queryParams: QueryParams, queryOptions: QueryOptions): User[] {
      return selectEntities<User>(store.entityMap(), queryParams, queryOptions);
    },
  })),
  withMethods((store, cachedLoads = inject(CachedListenersService), db = inject(FirebaseService)) => ({
    // streaming tries to reduce redundant loads through the following:
    // - caching listeners and reusing them with a 5-second delay after moving to a new container before unsubscribing
    // additionally, it has the following constraints:
    // - nested loadQueries are only loaded, not streamed, to prevent huge numbers of listeners.
    // - nested loadQueries can only be made based on the id of retrieved entities to ensure we only need to replay loads/adds
    // - containers pass in an id for loads, then onDestroy, they call cachedListeners.disconnect(id)
    async stream(
      queryParams: QueryParams,
      queryOptions: QueryOptions,
      injector,
      streamQueries?: (user: User) => EntityStreamQuery<AnyEntity>[],
      options?: {
        loading?: WritableSignal<boolean>, // set to true on start, set to false once all are complete
      },
    ) {
      try {
        // start loading icon if available
        options?.loading?.set(true);
        await cachedLoads.processStreamQuery('users', store, queryParams, queryOptions, injector, streamQueries, options);
      } catch (e) {
        console.error(e);

        // stop loading icon. when no error, loading icon is stopped
        // upon the initial payload coming through the stream and the
        // loadQueries being processed
        options?.loading?.set(false);
        throw e;
      }
    },
    // loading tries to reduce redundant loads through the following:
    // - below only applies when there are no queryOptions
    // - only loads (not deleted) entities since the last time this query was made and when there is not already an active stream for that
    // - delete entities since the last load where _deleted is true and when there is not already an active stream for that (which would handle deletions too)
    // - to calculate loadQueries, use the entities within the store (to get both the deltas and the things already loaded)
    async load(
      queryParams: QueryParams,
      queryOptions: QueryOptions,
      loadQueries?: (user: User) => EntityLoadQuery<AnyEntity>[],
      options?: {
        loading?: WritableSignal<boolean>,
      },
    ) {
      try {
        // start loading icon if available
        options?.loading?.set(true);

        // only load if there is not already a listener for the same query
        if (!cachedLoads.isStreamForQuery('users', queryParams, queryOptions)) {
          // get the last load time and next load time
          const lastLoadTime = cachedLoads.getLastLoadTime('users', queryParams, queryOptions);
          const newLoadTime = Timestamp.now().toMillis();

          // load entities since last load that are not deleted
          // note that we always load all entities if there exist queryOptions since adding
          // the _updatedAt filter will change queries with limit
          let queryParamsWithTime;
          if (lastLoadTime === -1 || (queryOptions && Object.keys(queryOptions).length > 0)) {
            queryParamsWithTime = [...queryParams, ['_deleted', '==', false]];
          } else {
            queryParamsWithTime = [
              ...queryParams,
              ['_updatedAt', '>', Timestamp.fromMillis(lastLoadTime)],
              ['_deleted', '==', false],
            ];
          }

          // get entities that have been added or updated since last load
          const entitiesDelta: User[] = await db.getEntities(
            'users',
            queryParamsWithTime,
            queryOptions,
          );
          patchState(store, setEntities(entitiesDelta, { idKey: '__id' }));

          // delete any new deleted entities
          if (lastLoadTime === -1 || (queryOptions && Object.keys(queryOptions).length > 0)) {
            const entitiesDeletedDelta: User[] = await db.getEntities(
              'users',
              [...queryParams, ['_deleted', '==', true]],
              queryOptions,
            );
            patchState(store, removeEntities(
              entitiesDeletedDelta.map((e) => e.__id),
            ));
          } else {
            const entitiesDeletedDelta: User[] = await db.getEntities(
              'users',
              [...queryParams,
                ['_updatedAt', '>', Timestamp.fromMillis(lastLoadTime)],
                ['_deleted', '==', true]],
              queryOptions,
            );
            patchState(store, removeEntities(
              entitiesDeletedDelta.map((e) => e.__id),
            ));
          }

          // save a new lastLoadTime for this query
          cachedLoads.setLastLoadTime('users', queryParams, queryOptions, newLoadTime);
        }

        if (loadQueries) {
          // retrieve entities from store for loading queries
          // note we cannot simply use entities from load since it may not be all entities (only those for which updatedAt > lastLoadTime)
          const allQueriedEntities = store.selectEntities(queryParams, queryOptions);

          await processLoadQueries<User>(allQueriedEntities, loadQueries);
        }
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        // stop loading icon
        options?.loading?.set(false);
      }
    },
    async count(
      queryParams: QueryParams,
      queryOptions: QueryOptions,
      options?: {
        loading?: WritableSignal<boolean>,
      },
    ): Promise<number> {
      try {
        // start loading icon if available
        options?.loading?.set(true);

        const queryParamsNotDeleted: QueryParams = [...queryParams, ['_deleted', '==', false]];
        return await db.count('users', queryParamsNotDeleted, queryOptions);
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        // stop loading icon
        options?.loading?.set(false);
      }
    },
    async aggregate<S extends Record<string, number>>(
      queryParams: QueryParams,
      queryOptions: QueryOptions,
      aggregateSpec: { [K in keyof S]: [string] | [string, string] },
      options?: {
        loading?: WritableSignal<boolean>,
      },
    ): Promise<{ [K in keyof S]: number }> {
      try {
        // start loading icon if available
        options?.loading?.set(true);

        const queryParamsNotDeleted: QueryParams = [...queryParams, ['_deleted', '==', false]];
        return await db.aggregate<S>(
          'users', queryParamsNotDeleted, queryOptions, aggregateSpec,
        );
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        // stop loading icon
        options?.loading?.set(false);
      }
    },
    async increment(id: string, field: string, delta: number, options?: {
      loading?: WritableSignal<boolean>,
      optimistic?: boolean
    }) {
      // get current value
      const currEntityValue = store.entityMap()[id];
      const changes = {};
      changes[field] = (currEntityValue[field] || 0) + delta;

      if (options?.optimistic) {
        try {
          // optimistically set then query backend
          patchState(store, updateEntity({ id, changes }));
          await db.incrementEntityField('users', id, field, delta);
        } catch (e) {
          // undo ngrx store value
          if (currEntityValue) {
            patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
          } else {
            patchState(store, removeEntity(id));
          }
          console.error(e);
          throw e;
        }
      } else {
        try {
          // start loading icon
          options?.loading?.set(true);

          // update entity
          await db.incrementEntityField('users', id, field, delta);
          patchState(store, updateEntity({ id, changes }));
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          // stop loading icon
          options?.loading?.set(false);
        }
      }
    },
    async add(entityOpId: User | Omit<User, '__id'>, options?: {
      loading?: WritableSignal<boolean>,
      optimistic?: boolean
    }) {
      // Create an __id if one was not provided
      const entity: User = Object.assign({}, entityOpId, {
        __id: entityOpId['__id'] || db.createId(),
      });

      if (options?.optimistic) {
        // get current value for resetting on error
        const currEntityValue = store.entityMap()[entity.__id];
        try {
          // optimistically set then query backend
          patchState(store, setEntity(entity, { idKey: '__id' }));
          await db.addEntity('users', entity);
        } catch (e) {
          // undo ngrx store value
          if (currEntityValue) {
            patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
          } else {
            patchState(store, removeEntity(entity.__id));
          }
          console.error(e);
          throw e;
        }
      } else {
        try {
          // start loading icon
          options?.loading?.set(true);

          // add entity
          await db.addEntity('users', entity);
          patchState(store, setEntity(entity, { idKey: '__id' }));
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          // stop loading icon
          options?.loading?.set(false);
        }
      }
    },
    async update(id: string, changes: Partial<User>, options?: {
      loading?: WritableSignal<boolean>,
      optimistic?: boolean
    }) {
      if (options?.optimistic) {
        // get current value for resetting on error
        const currEntityValue = store.entityMap()[id];
        try {
          // optimistically set then query backend
          patchState(store, updateEntity({ id, changes }));
          await db.updateEntity('users', id, changes);
        } catch (e) {
          // undo ngrx store value
          if (currEntityValue) {
            patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
          } else {
            patchState(store, removeEntity(id));
          }
          console.error(e);
          throw e;
        }
      } else {
        try {
          // start loading icon
          options?.loading?.set(true);

          // update entity
          await db.updateEntity('users', id, changes);
          patchState(store, updateEntity({ id, changes }));
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          // stop loading icon
          options?.loading?.set(false);
        }
      }
    },
    async remove(id: string, options?: {
      loading?: WritableSignal<boolean>,
      optimistic?: boolean
    }) {
      if (options?.optimistic) {
        // get current value for resetting on error
        const currEntityValue = store.entityMap()[id];
        try {
          // optimistically set then query backend
          patchState(store, removeEntity(id));

          // delete entity from DB (soft delete)
          await db.removeEntity('users', id);
        } catch (e) {
          // undo ngrx store value
          if (currEntityValue) {
            patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
          }
          console.error(e);
          throw e;
        }
      } else {
        try {
          // start loading icon
          options?.loading?.set(true);

          // soft deletion to support detecting changes (deltas) from a timestamp
          await db.removeEntity('users', id);
          patchState(store, removeEntity(id));
        } catch (e) {
          console.error(e);
          throw e;
        } finally {
          // stop loading icon
          options?.loading?.set(false);
        }
      }
    },
  })),
);
