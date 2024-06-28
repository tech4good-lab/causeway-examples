import { signalStore, StateSignal } from '@ngrx/signals';
import { Type, inject, Injectable, Injector } from '@angular/core';
import { QueryParams, QueryOptions, AnyEntity } from './app.model';

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
