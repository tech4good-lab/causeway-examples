import { Injectable, WritableSignal, inject, DestroyRef, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Subject, Observable, merge, forkJoin, of, from, pipe } from 'rxjs';
import { startWith, pairwise, publishLast, publish, publishReplay, refCount, tap, pluck, mergeMap, filter, takeUntil, skipUntil, buffer, skip, switchMap, map, take } from 'rxjs/operators';
import { patchState } from '@ngrx/signals';
import { setEntities, setEntity, removeEntities } from '@ngrx/signals/entities';
import { FirebaseService } from '../firebase/firebase.service';
import { EntityLoadQuery, EntityStreamQuery, entityInQueryResults } from '../store/app.store';
import { QueryParams, QueryOptions, AnyEntity } from '../store/app.model';
import { DocumentChange } from '@angular/fire/firestore';

export interface CachedConnection {
  queryKey: string;
  registeredSet: Set<DestroyRef>;
}

@Injectable({
  providedIn: 'root',
})
export class CachedListenersService {
  /** Cached connections by loadKey. */
  private connectionByQueryKey: Record<string, CachedConnection> = {};

  /** Close connection events. */
  private closeConnection$: Subject<string> = new Subject<string>();

  /** Load state across the app by queryKey. Stores last load time in milliseconds. */
  private lastLoadTime: Record<string, number> = {};

  /** Define a unique key for each connection. */
  private getQueryKey(collection: string, queryParams: QueryParams, queryOptions: QueryOptions): string {
    let queryOptionsString = '';
    if (queryOptions) {
      if (queryOptions.orderBy) {
        queryOptionsString = queryOptionsString.concat(`orderBy${queryOptions.orderBy}`);
      }
      if (queryOptions.limit) {
        queryOptionsString = queryOptionsString.concat(`limit${queryOptions.limit}`);
      }
      if (queryOptions.startAt) {
        queryOptionsString = queryOptionsString.concat(`startAt${queryOptions.startAt}`);
      }
      if (queryOptions.startAfter) {
        queryOptionsString = queryOptionsString.concat(`startAfter${queryOptions.startAfter}`);
      }
      if (queryOptions.endAt) {
        queryOptionsString = queryOptionsString.concat(`endAt${queryOptions.endAt}`);
      }
      if (queryOptions.endBefore) {
        queryOptionsString = queryOptionsString.concat(`endBefore${queryOptions.endBefore}`);
      }
    }
    return `${collection}.${queryParams.sort()}.${queryOptionsString}`;
  }

  /** Return whether a stream exists for this query. */
  isStreamForQuery(collection: string, queryParams: QueryParams, queryOptions: QueryOptions): boolean {
    const queryKey = this.getQueryKey(collection, queryParams, queryOptions);
    return !!this.connectionByQueryKey[queryKey];
  }

  /** Get the last load time for a particular query. */
  getLastLoadTime(collection: string, queryParams: QueryParams, queryOptions: QueryOptions): number {
    // If there are queryOptions, we don't support saving load times
    if (queryOptions && Object.keys(queryOptions).length > 0) return -1;

    const queryKey = this.getQueryKey(collection, queryParams, queryOptions);
    return this.lastLoadTime[queryKey] || -1;
  }

  /** Set the last load time for a particular query. */
  setLastLoadTime(collection: string, queryParams: QueryParams, queryOptions: QueryOptions, time: number): void {
    // If there are queryOptions, we don't support saving load times
    if (queryOptions && Object.keys(queryOptions).length > 0) return;

    const queryKey = this.getQueryKey(collection, queryParams, queryOptions);
    this.lastLoadTime[queryKey] = time;
  }

  /** Gets a cached connection if one exists.  */
  private getConnection(collection: string, queryParams: QueryParams, queryOptions: QueryOptions): CachedConnection {
    const queryKey = this.getQueryKey(collection, queryParams, queryOptions);
    return this.connectionByQueryKey[queryKey];
  }

  /**
   * Main function called by the outside.
   */
  public async processStreamQuery<T extends { __id: string }>(
    collection: string,
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    injector,
    streamQueries?: (entity: T) => EntityStreamQuery<AnyEntity>[],
    options?: {
      loading?: WritableSignal<boolean>,
    },
  ): Promise<CachedConnection> {
    // console.log("PROCESS QUERY: " + this.getQueryKey(collection, queryParams, queryOptions));

    // Get destroyRef for the component that called processStreamQuery
    // (which will be used to determine when to trigger unsubscribe)
    const destroyRef = injector.get(DestroyRef);

    // get connection and process the immediate query
    let connection = this.getConnection(collection, queryParams, queryOptions);

    if (connection) {
      // if the connection already exists, don't need to create a new connection,
      // but may need to add the DestroyRef if it doesn't already exist
      if (!connection.registeredSet.has(destroyRef)) {
        connection.registeredSet.add(destroyRef);
      }
    } else {
      // if the connection does not exist, create it and initialize the
      // registeredSet to include destroyRef
      // this function also will subscribe and link to the store
      connection = this.createConnection(collection, store, queryParams, queryOptions, destroyRef, injector);
      this.connectionByQueryKey[connection.queryKey] = connection;
    }

    // Unregister from the connection when the component is destroyed
    // Disconnects the "virtual" connection. If this was the only DestroyRef,
    // then actually unsubscribe
    destroyRef.onDestroy(() => {
      // Add a 5-second delay so we don't have to reconnect multiple times
      // if the next view happens to use the same stream
      setTimeout(() => {
        connection.registeredSet.delete(destroyRef);
        if (connection.registeredSet.size === 0) {
          this.closeConnection$.next(connection.queryKey);
          this.connectionByQueryKey[connection.queryKey] = undefined;
        }
      }, 5000);
    });

    // For every new entity on the stream, process the nested streamQueries
    if (streamQueries) {
      // get the entities we're streaming as a signal. we do it here rather than
      // using the firestore stream so that we can always get the latest version
      // without needing to multicast the original stream to all future components
      // querying for the stream
      const streamEntities = computed(() => {
        return store.selectEntities(queryParams, queryOptions);
      });

      // convert to an observable, convert to the changes, then subscribe
      // note: we do not need takeUntil for unsubscribing because toObservable will
      // unsubscribe once the injector context (passed in from the component/container) is destroyed
      toObservable(streamEntities, { injector }).pipe(
        // convert to entityMap to more easily compare
        map((entities) => {
          const entityMap = {};
          for (const entity of entities) {
            entityMap[entity.__id] = entity;
          }
          return entityMap;
        }),
        // compare current with prior including the first
        startWith(undefined),
        pairwise(),
        // get the changedEntities
        map(([prevEntities, currEntities]) => {
          const changedEntities = [];
          for (const key in currEntities) {
            if (!(key in prevEntities)) {
            // the entity was added
              changedEntities.push({
                type: 'added',
                doc: currEntities[key],
              });
            } else if (currEntities[key]['_deleted']) {
            // the entity was removed
              changedEntities.push({
                type: 'removed',
                doc: currEntities[key],
              });
            } else if (currEntities[key]['_updatedAt'] !== prevEntities[key]['_updatedAt']) {
            // the entity was modified
              changedEntities.push({
                type: 'modified',
                doc: currEntities[key],
              });
            }
          }

          return changedEntities;
        }),
        // We don't need the removed ones for nested streamQueries (but I just
        // included it above for debugging purposes so we can see all changes)
        map((changes) => changes.filter((c) => c.type !== 'removed')),
        filter((changes) => changes.length > 0),
      ).subscribe(async (changes) => {
        // create a matrix of queries, each row corresponding to a given entity
        const queriesByEntity = changes.map((change) => streamQueries(change.doc));

        // transpose the matrix so each row corresponds to all queries for the same query type
        const queriesByQueryType = queriesByEntity[0].map((_, colIndex) => queriesByEntity.map((row) => row[colIndex]));

        // Process all query types concurrently
        await Promise.all(queriesByQueryType.map(async (queriesForOneType) => {
          // Seeing if we can optimize by collapsing equality queries into 'in' queries
          const optimizedQueries = EntityStreamQuery.optimize(queriesForOneType);

          // Process queries concurrently using Promise.all
          await Promise.all(optimizedQueries.filter((q) => !!q).map(async (query) => {
            await this.processStreamQuery(query.collection, query.store, query.queryParams, query.queryOptions, injector, query.streamQueries, {
              loading: options?.loading,
            });
          }));
        }));
      });
    } else {
      // We'll turn off the loading indicator the first time there is a query that doesn't have nested queries
      // (ideally we'd want to turn if off after each of the streams have gotten their first entities, but I
      // don't think we can do that easily and this won't be too off)
      options?.loading?.set(false);
    }

    return connection;
  }

  private createConnection(collection: string, store, queryParams: QueryParams, queryOptions: QueryOptions, destroyRef: DestroyRef, injector): CachedConnection {
    // console.log("CONNECT " + this.getQueryKey(collection, queryParams, queryOptions));

    // ------------ DEFINE OBSERVABLES FOR DISCONNECTING ------------------------------

    const queryKey = this.getQueryKey(collection, queryParams, queryOptions);
    const disconnectObs$ = this.closeConnection$.pipe(
      filter((qk) => qk === queryKey),
      take(1),
      // tap(a => { console.log("DISCONNECT: " + queryKey) }),
      publish(),
      refCount(),
    );

    // ------------ HANDLE PATCHING TO STORE ------------------------------------------

    // Handle patching to the store
    this.db.streamEntitiesChanges(collection, queryParams, queryOptions, injector).pipe(
      takeUntil(disconnectObs$),
    ).subscribe((fbPayload) => {
      // Handle all the added entities
      const entitiesToAdd = fbPayload
        .filter((dc) => dc.type === 'added' && !dc.docData['_deleted'])
        .map((dc) => dc.docData);

      // Handle all the modified entities
      const entitiesToModify = fbPayload
        .filter((dc) => dc.type === 'modified' && !dc.docData['_deleted'])
        .map((dc) => dc.docData);

      // Handle all the removed entities
      const entitiesToRemove = fbPayload
        .filter((dc) => dc.type === 'modified' && dc.docData['_deleted'])
        .map((dc) => dc.docData['__id']);

      // Handle changes of the 'removed' type. In general, firebase 'removed'
      // could be due to no longer matching the stream query rather than being
      // deleted from the DB. this is why we use soft deletes (set _deleted to true)
      // so technically we shouldn't be getting any 'removed' entries. however,
      // if there were manual deletions in the database, there could still be changes
      // of this type which the below code seeks to handle
      const entitiesToModify2 = fbPayload
        .filter((dc) => dc.type === 'removed' && !entityInQueryResults(dc.docData, queryParams, queryOptions))
        .map((dc) => dc.docData);


      const entitiesToRemove2 = fbPayload
        .filter((dc) => dc.type === 'removed' && entityInQueryResults(dc.docData, queryParams, queryOptions))
        .map((dc) => dc.docData['__id']);

      // Patch all the changes to the store
      patchState(store, setEntities(entitiesToAdd, { idKey: '__id' }));
      patchState(store, setEntities([...entitiesToModify, ...entitiesToModify2], { idKey: '__id' }));
      patchState(store, removeEntities([...entitiesToRemove, ...entitiesToRemove2]));
    });

    return {
      queryKey: this.getQueryKey(collection, queryParams, queryOptions),
      registeredSet: new Set<DestroyRef>([destroyRef]),
    };
  }

  constructor(
    private db: FirebaseService,
  ) { }
}
