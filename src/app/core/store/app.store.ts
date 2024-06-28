import { Type, WritableSignal, inject, Injectable, Injector } from '@angular/core';
import { QueryParams, QueryOptions, AnyEntity } from './app.model';
import { withEntities, setAllEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { signalStore, patchState, withState, withMethods, signalStoreFeature } from '@ngrx/signals';
import { CachedListenersService } from '../firebase/cached-listeners.service';
import { FirebaseService } from '../firebase/firebase.service';
import { Timestamp } from '@angular/fire/firestore';

interface BaseEntity {
  __id: string;
}

export function withEntitiesAndSelectMethods<S extends BaseEntity>() {
  return signalStoreFeature(
    withEntities<S>(),
    withMethods((store) => ({
      selectEntity(id: string): S {
        return store.entityMap()[id];
      },
      selectFirst(queryParams: QueryParams, queryOptions: QueryOptions): S {
        const entities = selectEntities<S>(store.entityMap(), queryParams, queryOptions);
        if (entities && entities.length > 0) {
          return entities[0];
        } else {
          return undefined;
        }
      },
      selectEntities(queryParams: QueryParams, queryOptions: QueryOptions): S[] {
        return selectEntities<S>(store.entityMap(), queryParams, queryOptions);
      },
    })),
  );
}

//export function withEntitiesAndDBMethods<S extends AnyEntity>(collectionName: string) {
//  return signalStoreFeature(
//    withEntitiesAndSelectMethods<S>(),
//    withMethods((store, cachedLoads = inject(CachedListenersService), db = inject(FirebaseService)) => ({
//      // streaming tries to reduce redundant loads through the following:
//      // - caching listeners and reusing them with a 5-second delay after moving to a new container before unsubscribing
//      // additionally, it has the following constraints:
//      // - nested loadQueries are only loaded, not streamed, to prevent huge numbers of listeners.
//      // - nested loadQueries can only be made based on the id of retrieved entities to ensure we only need to replay loads/adds
//      // - containers pass in an id for loads, then onDestroy, they call cachedListeners.disconnect(id)
//      async stream(
//        queryParams: QueryParams,
//        queryOptions: QueryOptions,
//        injector,
//        streamQueries?: (entity: S) => EntityStreamQuery<AnyEntity>[],
//        options?: {
//          loading?: WritableSignal<boolean>,
//        },
//      ) {
//        try {
//          // start loading icon if available
//          options?.loading?.set(true);
//
//          await cachedLoads.processStreamQuery(collectionName, store, queryParams, queryOptions, injector, streamQueries, options);
//        } catch (e) {
//          console.error(e);
//
//          // stop loading icon. when no error, loading icon is stopped
//          // upon the initial payload coming through the stream and the
//          // loadQueries being processed
//          options?.loading?.set(false);
//          throw e;
//        }
//      },
//      // loading tries to reduce redundant loads through the following:
//      // - below only applies when there are no queryOptions
//      // - only loads (not deleted) entities since the last time this query was made and when there is not already an active stream for that
//      // - delete entities since the last load where _deleted is true and when there is not already an active stream for that (which would handle deletions too)
//      // - to calculate loadQueries, use the entities within the store (to get both the deltas and the things already loaded)
//      async load(
//        queryParams: QueryParams,
//        queryOptions: QueryOptions,
//        loadQueries?: (entity: S) => EntityLoadQuery<AnyEntity>[],
//        options?: {
//          loading?: WritableSignal<boolean>,
//        },
//      ) {
//        try {
//          // start loading icon if available
//          options?.loading?.set(true);
//
//          // only load if there is not already a listener for the same query
//          if (!cachedLoads.isStreamForQuery(collectionName, queryParams, queryOptions)) {
//            // get the last load time and next load time
//            const lastLoadTime = cachedLoads.getLastLoadTime(collectionName, queryParams, queryOptions);
//            const newLoadTime = Timestamp.now().toMillis();
//
//            // // load entities since last load that are not deleted
//            // // note that we always load all entities if there exist queryOptions since adding
//            // // the _updatedAt filter will change queries with limit
//            // let queryParamsWithTime;
//            // if (lastLoadTime === -1 || (queryOptions && Object.keys(queryOptions).length > 0)) {
//            //   queryParamsWithTime = [...queryParams, ['_deleted', '==', false]];
//            // } else {
//            //   queryParamsWithTime = [
//            //     ...queryParams,
//            //     ['_updatedAt', '>', Timestamp.fromMillis(lastLoadTime)],
//            //     ['_deleted', '==', false],
//            //   ];
//            // }
//
//            // get entities that have been added or updated since last load
//            const entitiesDelta: S[] = await db.getEntities(
//              collectionName,
//              queryParams, //queryParamsWithTime,
//              queryOptions,
//            );
//            const selectId: SelectEntityId<S> = (e) => e.__id;
//            patchState(store, setEntities(entitiesDelta, selectId));
//
//            // // delete any new deleted entities
//            // if (lastLoadTime === -1 || (queryOptions && Object.keys(queryOptions).length > 0)) {
//            //   const entitiesDeletedDelta: S[] = await db.getEntities(
//            //     collectionName,
//            //     [...queryParams, ['_deleted', '==', true]],
//            //     queryOptions,
//            //   );
//            //   patchState(store, removeEntities(
//            //     entitiesDeletedDelta.map((e) => e.__id),
//            //   ));
//            // } else {
//            //   const entitiesDeletedDelta: S[] = await db.getEntities(
//            //     collectionName,
//            //     [...queryParams,
//            //       ['_updatedAt', '>', Timestamp.fromMillis(lastLoadTime)],
//            //       ['_deleted', '==', true]],
//            //     queryOptions,
//            //   );
//            //   patchState(store, removeEntities(
//            //     entitiesDeletedDelta.map((e) => e.__id),
//            //   ));
//            // }
//
//            // // save a new lastLoadTime for this query
//            // cachedLoads.setLastLoadTime(collectionName, queryParams, queryOptions, newLoadTime);
//          }
//
//          // if (loadQueries) {
//          //   // retrieve entities from store for loading queries
//          //   // note we cannot simply use entities from load since it may not be all entities (only those for which updatedAt > lastLoadTime)
//          //   const allQueriedEntities = store.selectEntities(queryParams, queryOptions);
//          //   await processLoadQueries<S>(allQueriedEntities, loadQueries);
//          // }
//        } catch (e) {
//          console.error(e);
//          throw e;
//        } finally {
//          // stop loading icon
//          options?.loading?.set(false);
//        }
//      },
//      // async count(
//      //   queryParams: QueryParams,
//      //   queryOptions: QueryOptions,
//      //   options?: {
//      //     loading?: WritableSignal<boolean>,
//      //   },
//      // ): Promise<number> {
//      //   try {
//      //     // start loading icon if available
//      //     options?.loading?.set(true);
//
//      //     const queryParamsNotDeleted: QueryParams = [...queryParams, ['_deleted', '==', false]];
//      //     return await db.count(collectionName, queryParamsNotDeleted, queryOptions);
//      //   } catch (e) {
//      //     console.error(e);
//      //     throw e;
//      //   } finally {
//      //     // stop loading icon
//      //     options?.loading?.set(false);
//      //   }
//      // },
//      // async aggregate<T extends Record<string, number>>(
//      //   queryParams: QueryParams,
//      //   queryOptions: QueryOptions,
//      //   aggregateSpec: { [K in keyof T]: [string] | [string, string] },
//      //   options?: {
//      //     loading?: WritableSignal<boolean>,
//      //   },
//      // ): Promise<{ [K in keyof T]: number }> {
//      //   try {
//      //     // start loading icon if available
//      //     options?.loading?.set(true);
//
//      //     const queryParamsNotDeleted: QueryParams = [...queryParams, ['_deleted', '==', false]];
//      //     return await db.aggregate<T>(
//      //       collectionName, queryParamsNotDeleted, queryOptions, aggregateSpec,
//      //     );
//      //   } catch (e) {
//      //     console.error(e);
//      //     throw e;
//      //   } finally {
//      //     // stop loading icon
//      //     options?.loading?.set(false);
//      //   }
//      // },
//      // async increment(id: string, field: string, delta: number, options?: {
//      //   loading?: WritableSignal<boolean>,
//      //   optimistic?: boolean
//      // }) {
//      //   // get current value
//      //   const currEntityValue = store.entityMap()[id];
//      //   const changes = {};
//      //   changes[field] = (currEntityValue[field] || 0) + delta;
//
//      //   if (options?.optimistic) {
//      //     try {
//      //       // optimistically set then query backend
//      //       patchState(store, updateEntity({ id, changes }));
//      //       await db.incrementEntityField(collectionName, id, field, delta);
//      //     } catch (e) {
//      //       // undo ngrx store value
//      //       if (currEntityValue) {
//      //         patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
//      //       } else {
//      //         patchState(store, removeEntity(id));
//      //       }
//      //       console.error(e);
//      //       throw e;
//      //     }
//      //   } else {
//      //     try {
//      //       // start loading icon
//      //       options?.loading?.set(true);
//
//      //       // update entity
//      //       await db.incrementEntityField(collectionName, id, field, delta);
//      //       patchState(store, updateEntity({ id, changes }));
//      //     } catch (e) {
//      //       console.error(e);
//      //       throw e;
//      //     } finally {
//      //       // stop loading icon
//      //       options?.loading?.set(false);
//      //     }
//      //   }
//      // },
//      // async add(entityOpId: S | Omit<S, '__id'>, options?: {
//      //   loading?: WritableSignal<boolean>,
//      //   optimistic?: boolean
//      // }) {
//      //   // Create an __id if one was not provided
//      //   const entity: S = Object.assign({}, entityOpId, {
//      //     __id: entityOpId['__id'] || db.createId(),
//      //   });
//
//      //   if (options?.optimistic) {
//      //     // get current value for resetting on error
//      //     const currEntityValue = store.entityMap()[entity.__id];
//      //     try {
//      //       // optimistically set then query backend
//      //       patchState(store, setEntity(entity, { idKey: '__id' }));
//      //       await db.addEntity(collectionName, entity);
//      //     } catch (e) {
//      //       // undo ngrx store value
//      //       if (currEntityValue) {
//      //         patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
//      //       } else {
//      //         patchState(store, removeEntity(entity.__id));
//      //       }
//      //       console.error(e);
//      //       throw e;
//      //     }
//      //   } else {
//      //     try {
//      //       // start loading icon
//      //       options?.loading?.set(true);
//
//      //       // add entity
//      //       await db.addEntity(collectionName, entity);
//      //       patchState(store, setEntity(entity, { idKey: '__id' }));
//      //     } catch (e) {
//      //       console.error(e);
//      //       throw e;
//      //     } finally {
//      //       // stop loading icon
//      //       options?.loading?.set(false);
//      //     }
//      //   }
//      // },
//      // async update(id: string, changes: Partial<S>, options?: {
//      //   loading?: WritableSignal<boolean>,
//      //   optimistic?: boolean
//      // }) {
//      //   if (options?.optimistic) {
//      //     // get current value for resetting on error
//      //     const currEntityValue = store.entityMap()[id];
//      //     try {
//      //       // optimistically set then query backend
//      //       patchState(store, updateEntity({ id, changes }));
//      //       await db.updateEntity(collectionName, id, changes);
//      //     } catch (e) {
//      //       // undo ngrx store value
//      //       if (currEntityValue) {
//      //         patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
//      //       } else {
//      //         patchState(store, removeEntity(id));
//      //       }
//      //       console.error(e);
//      //       throw e;
//      //     }
//      //   } else {
//      //     try {
//      //       // start loading icon
//      //       options?.loading?.set(true);
//
//      //       // update entity
//      //       await db.updateEntity(collectionName, id, changes);
//      //       patchState(store, updateEntity({ id, changes }));
//      //     } catch (e) {
//      //       console.error(e);
//      //       throw e;
//      //     } finally {
//      //       // stop loading icon
//      //       options?.loading?.set(false);
//      //     }
//      //   }
//      // },
//      // async remove(id: string, options?: {
//      //   loading?: WritableSignal<boolean>,
//      //   optimistic?: boolean
//      // }) {
//      //   if (options?.optimistic) {
//      //     // get current value for resetting on error
//      //     const currEntityValue = store.entityMap()[id];
//      //     try {
//      //       // optimistically set then query backend
//      //       patchState(store, removeEntity(id));
//
//      //       // delete entity from DB (soft delete)
//      //       await db.removeEntity(collectionName, id);
//      //     } catch (e) {
//      //       // undo ngrx store value
//      //       if (currEntityValue) {
//      //         patchState(store, setEntity(currEntityValue, { idKey: '__id' }));
//      //       }
//      //       console.error(e);
//      //       throw e;
//      //     }
//      //   } else {
//      //     try {
//      //       // start loading icon
//      //       options?.loading?.set(true);
//
//      //       // soft deletion to support detecting changes (deltas) from a timestamp
//      //       await db.removeEntity(collectionName, id);
//      //       patchState(store, removeEntity(id));
//      //     } catch (e) {
//      //       console.error(e);
//      //       throw e;
//      //     } finally {
//      //       // stop loading icon
//      //       options?.loading?.set(false);
//      //     }
//      //   }
//      // },
//    })),
//  );
//}
    
/**
 * Select entities from store given the entityMap and queries
 * Note: firestore supports setting and querying for null, but not
 * undefined. We filter out cases where the value is undefined
 * to protect against cases when people are doing a nested query
 * and some entity does not have a particular field, e.g.
 * [['__hashtagId', '==', q.__hashtagId]] when __hashtagId is
 * an optional parameter
 */
export function selectEntities<T>(entityMap: Record<string, T>, queryParams: QueryParams, queryOptions: QueryOptions): T[] {
  let filteredEntities = [];

  // APPLY '__id', '=='/in FILTERS
  const selectIdEqQueries = queryParams.filter((q) => q[0] === '__id' && q[1] === '==' && q[2] !== undefined);
  const uniqSelectEqIds = selectIdEqQueries.map((q) => q[2]).filter((q, i, a) => a.indexOf(q) === i);
  const selectIdInQueries = queryParams
    .filter((q) => q[0] === '__id' && q[1] === 'in' && q[2] !== undefined)
    .map((q) => [q[0], q[1], q[2].filter((v) => v !== undefined)])
    .filter((q) => q[2].length > 0);

  if (uniqSelectEqIds.length === 1 && entityMap[uniqSelectEqIds[0]]) {
    // If there is exactly one '__id', we can start with that to filter
    if (entityMap[uniqSelectEqIds[0]]) {
      filteredEntities.push(entityMap[uniqSelectEqIds[0]]);
    }
  } else if (uniqSelectEqIds.length > 1) {
    // If there are more than one select id ==, then there cannot be any matches
    return [];
  } else if (selectIdInQueries.length > 0) {
    // If there is at least one 'in' query, start with that.
    const firstInIds = selectIdInQueries[0][2];
    filteredEntities = firstInIds.map((id) => entityMap[id]).filter((e) => e !== undefined);

    // Then apply remaining 'in' filters. See general filter section
    // for comments since this is just copied from that.
    if (selectIdInQueries.length > 1) {
      filteredEntities = filteredEntities.filter((e) => {
        return !selectIdInQueries.slice(1).find((f) => {
          const [key, rel, val] = f;
          return !(val.includes(e[key]));
        });
      });
    }
  } else {
    // Otherwise, start with the full list and filter further.
    filteredEntities = Object.keys(entityMap).map((id) => entityMap[id]);
  }

  // APPLY REMAINING FILTERS
  if (queryParams) {
    filteredEntities = filteredEntities.filter((e) => {
      // Looks for the first failed filter. If there exists any,
      // return false (filter it out)
      return !queryParams.find((f) => {
        const [key, rel, val] = f;

        // already processed '__id', '=='/'in', so always passes this filter
        if (key === '__id' && (rel === '==' || rel === 'in')) {
          return false;
        }

        // value cannot be undefined. if it is, we ignore this query
        // parameter (so it always passes)
        if (val === undefined) {
          return false;
        }

        // we try to handle the same operations as Firestore for consistency
        switch (rel) {
          case '==':
            return !(e[key] === val);

          case '!=':
            return !(e[key] !== val);

          case '>=':
            return !(e[key] >= val);

          case '<=':
            return !(e[key] <= val);

          case '>':
            return !(e[key] > val);

          case '<':
            return !(e[key] < val);

          case 'array-contains':
            // If the parameter in question is optional, it should be filtered out
            return e[key] ? !e[key].includes(val) : true;

          case 'array-contains-any':
            // If the parameter in question is optional, it should be filtered out
            return e[key] ? !val.some((v) => e[key].includes(v)) : true;

          case 'in':
            return !val.includes(e[key]);

          case 'not-in':
            return val.includes(e[key]);

          default:
            return false;
        }
      });
    });
  }

  // Sort based on orderBy
  if (queryOptions?.orderBy) {
    // If orderBy is provided, will only return entities with that property
    // just like the Firestore API

    const [field, order] = Array.isArray(queryOptions.orderBy) ? queryOptions.orderBy : [queryOptions.orderBy, 'asc'];

    filteredEntities = filteredEntities.filter((e) => e[field] !== undefined && e[field] !== null);
    filteredEntities.sort((a, b) => {
      if (a[field] < b[field]) return order === 'desc' ? 1 : -1;
      if (a[field] > b[field]) return order === 'desc' ? -1 : 1;
      return 0;
    });
  }

  // Filter based on startAt/startAfter/endAt/endAfter
  if (queryOptions?.orderBy && (queryOptions?.startAt !== undefined || queryOptions?.startAfter !== undefined ||
      queryOptions?.endAt !== undefined || queryOptions?.endBefore !== undefined)) {
    filteredEntities = filteredEntities.filter((e) => {
      const value = e[queryOptions.orderBy as string];
      if (queryOptions.startAt !== undefined && value < queryOptions.startAt) {
        return false;
      }
      if (queryOptions.startAfter !== undefined && value <= queryOptions.startAfter) {
        return false;
      }
      if (queryOptions.endAt !== undefined && value > queryOptions.endAt) {
        return false;
      }
      if (queryOptions.endBefore !== undefined && value >= queryOptions.endBefore) {
        return false;
      }
      return true;
    });
  }

  // Limit based on limit
  if (queryOptions?.limit !== undefined) {
    filteredEntities = filteredEntities.slice(0, queryOptions.limit);
  }

  return filteredEntities;
}

/** Select entities from store given the entityMap and queries */
export function entityInQueryResults<T>(e: T, queryParams: QueryParams, queryOptions: QueryOptions): boolean {
  if (queryParams) {
    // Looks for the first failed filter. If there exists any,
    // return false
    const inQueryParams = !queryParams.find((f) => {
      const [key, rel, val] = f;

      // value cannot be undefined. if it is, we ignore this query
      // parameter (so it always passes)
      if (val === undefined) {
        return false;
      }

      // we try to handle the same operations as Firestore for consistency
      switch (rel) {
        case '==':
          return !(e[key] === val);

        case '!=':
          return !(e[key] !== val);

        case '>=':
          return !(e[key] >= val);

        case '<=':
          return !(e[key] <= val);

        case '>':
          return !(e[key] > val);

        case '<':
          return !(e[key] < val);

        case 'array-contains':
          // If the parameter in question is optional, it should be filtered out
          return e[key] ? !e[key].includes(val) : true;

        case 'array-contains-any':
          // If the parameter in question is optional, it should be filtered out
          return e[key] ? !val.some((v) => e[key].includes(v)) : true;

        case 'in':
          return !val.includes(e[key]);

        case 'not-in':
          return val.includes(e[key]);

        default:
          return false;
      }
    });

    if (!inQueryParams) {
      return false;
    }
  }

  // Filter based on startAt/startAfter/endAt/endAfter
  if (queryOptions?.orderBy && (queryOptions?.startAt !== undefined || queryOptions?.startAfter !== undefined ||
      queryOptions?.endAt !== undefined || queryOptions?.endBefore !== undefined)) {
    const value = e[queryOptions.orderBy as string];
    if (queryOptions.startAt !== undefined && value < queryOptions.startAt) {
      return false;
    }
    if (queryOptions.startAfter !== undefined && value <= queryOptions.startAfter) {
      return false;
    }
    if (queryOptions.endAt !== undefined && value > queryOptions.endAt) {
      return false;
    }
    if (queryOptions.endBefore !== undefined && value >= queryOptions.endBefore) {
      return false;
    }
  }

  return true;
}

export async function processLoadQueries<T extends { __id: string }>(entities: T[], loadQueries: (entity: T) => EntityLoadQuery<AnyEntity>[]) {
  if (entities.length > 0) {
    // create a matrix of queries, each row corresponding to a given entity
    const queriesByEntity = entities.map((entity) => loadQueries!(entity));

    // transpose the matrix so each row corresponds to all queries for the same query type
    const queriesByQueryType = queriesByEntity[0].map((_, colIndex) => queriesByEntity.map((row) => row[colIndex]));

    // Process all query types concurrently
    await Promise.all(queriesByQueryType.map(async (queriesForOneType) => {
      // Seeing if we can optimize by collapsing equality queries into 'in' queries
      const optimizedQueries = EntityLoadQuery.optimize(queriesForOneType);

      // Process queries concurrently using Promise.all
      await Promise.all(optimizedQueries.filter((q) => !!q).map(async (query) => {
        await query.store.load(query.queryParams, query.queryOptions, query.loadQueries);
      }));
    }));
  }
}

export class EntityLoadQuery<T> {
  collection: string;
  queryParams: QueryParams;
  queryOptions: QueryOptions;
  loadQueries: (entity: T) => EntityLoadQuery<AnyEntity>[];
  store;

  constructor(
    collection: string,
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    loadQueries?: (entity: T) => EntityLoadQuery<AnyEntity>[],
  ) {
    this.collection = collection;
    this.queryParams = queryParams;
    this.queryOptions = queryOptions;
    this.loadQueries = loadQueries;
    this.store = store;
  }

  // Checks if there is a single equality query of the same type
  // that could be transformed into an 'in' query
  static isEqualityQuery<T>(queries: EntityLoadQuery<T>[]): boolean {
    if (queries.length === 0) return false;

    // check if there is only one queryParam for each query
    const hasSingleQueryParam = queries.every((q) => q.queryParams.length === 1);

    if (!hasSingleQueryParam) return false;

    // check if the field is the same and it is an equality query
    const firstField = queries[0].queryParams[0][0];
    return queries.every((q) => q.queryParams[0][0] === firstField && q.queryParams[0][1] === '==');
  }

  // This currently only optimizes for N+1 queries, transforming input queries
  // with a single where equality query (e.g. [['__postId', '==', x]]) and no queryParams.
  // Transform this into 'in' queries, combining up to 30 equality clauses
  // at the same time, https://firebase.google.com/docs/firestore/query-data/queries#in_and_array-contains-any.
  static optimize<T>(queries: EntityLoadQuery<T>[]): EntityLoadQuery<T>[] {
    // TODO: we are temporarily not doing any of these optimizations until we can
    // figure out a better way to prevent reloading of duplicate queries. Right
    // now we remember the load time of particular queries which allows us to
    // only query for documents past a given time. However, by grouping them
    // together into 'in' queries, we won't be able to take advantage of that since
    // the grouping could be different as entities are added/deleted
    return queries;

    if (this.isEqualityQuery<T>(queries)) {
      // get the field we are querying against
      const collection: string = queries[0].collection;
      const field: string = queries[0].queryParams[0][0];
      const loadQs: (entity: T) => EntityLoadQuery<AnyEntity>[] = queries[0].loadQueries;

      // chunk queries into chunks of 30
      const chunkedQueries: EntityLoadQuery<T>[][] = [];
      for (let i = 0; i < queries.length; i += 30) {
        chunkedQueries.push(queries.slice(i, i + 30));
      }

      // transform every 30 into an 'in' query
      return chunkedQueries.map((queryChunk) => {
        const ids = queryChunk.map((q) => q.queryParams[0][2]);
        return new EntityLoadQuery<T>(collection, queries[0].store, [[field, 'in', ids]], {}, loadQs);
      });
    } else {
      return queries;
    }
  }
}

export class EntityStreamQuery<T> {
  collection: string;
  queryParams: QueryParams;
  queryOptions: QueryOptions;
  streamQueries: (entity: T) => EntityStreamQuery<AnyEntity>[];
  store;

  constructor(
    collection: string,
    store,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    streamQueries?: (entity: T) => EntityStreamQuery<AnyEntity>[],
  ) {
    this.collection = collection;
    this.queryParams = queryParams;
    this.queryOptions = queryOptions;
    this.streamQueries = streamQueries;
    this.store = store;
  }

  // Checks if there is a single equality query of the same type
  // that could be transformed into an 'in' query
  static isEqualityQuery<T>(queries: EntityStreamQuery<T>[]): boolean {
    if (queries.length === 0) return false;

    // check if there is only one queryParam for each query
    const hasSingleQueryParam = queries.every((q) => q.queryParams.length === 1);

    if (!hasSingleQueryParam) return false;

    // check if the field is the same and it is an equality query
    const firstField = queries[0].queryParams[0][0];
    return queries.every((q) => q.queryParams[0][0] === firstField && q.queryParams[0][1] === '==');
  }

  // This currently only optimizes for N+1 queries, transforming input queries
  // with a single where equality query (e.g. [['__postId', '==', x]]) and no queryParams.
  // Transform this into 'in' queries, combining up to 30 equality clauses
  // at the same time, https://firebase.google.com/docs/firestore/query-data/queries#in_and_array-contains-any.
  static optimize<T>(queries: EntityStreamQuery<T>[]): EntityStreamQuery<T>[] {
    // TODO: we are temporarily not doing any of these optimizations until we can
    // figure out a better way to prevent reloading of duplicate queries. Right
    // now we remember the load time of particular queries which allows us to
    // only query for documents past a given time. However, by grouping them
    // together into 'in' queries, we won't be able to take advantage of that since
    // the grouping could be different as entities are added/deleted
    return queries;

    if (this.isEqualityQuery<T>(queries)) {
      // get the field we are querying against
      const collection: string = queries[0].collection;
      const field: string = queries[0].queryParams[0][0];
      const streamQs: (entity: T) => EntityStreamQuery<AnyEntity>[] = queries[0].streamQueries;

      // chunk queries into chunks of 30
      const chunkedQueries: EntityStreamQuery<T>[][] = [];
      for (let i = 0; i < queries.length; i += 30) {
        chunkedQueries.push(queries.slice(i, i + 30));
      }

      // transform every 30 into an 'in' query
      return chunkedQueries.map((queryChunk) => {
        const ids = queryChunk.map((q) => q.queryParams[0][2]);
        return new EntityStreamQuery<T>(collection, queries[0].store, [[field, 'in', ids]], {}, streamQs);
      });
    } else {
      return queries;
    }
  }
}
