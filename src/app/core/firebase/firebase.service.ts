import { Injectable, inject, Injector, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, merge, of, from, pipe } from 'rxjs';
import { tap, pluck, mergeMap, pairwise, startWith, filter, takeUntil, skip, switchMap, map, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Firestore, DocumentSnapshot, serverTimestamp, Timestamp, getDoc, getDocs, doc, setDoc, updateDoc, deleteDoc, docData, collection, collectionData, collectionChanges, query, where, orderBy, OrderByDirection, limit, startAt, startAfter, endAt, endBefore, DocumentChange, increment, AggregateQuerySnapshot, AggregateField, AggregateSpec, getAggregateFromServer, getCountFromServer } from '@angular/fire/firestore';
import { AnyEntity, QueryParams, QueryOptions } from '../store/app.model';
import { AuthDB, HashtagDB, LongTermGoalDB, QuarterlyGoalDB, ReflectionDB, UserDB, WeeklyGoalDB } from './mock-db.service';
import { User } from '../store/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  readonly authDB = inject(AuthDB);
  readonly DB = {
    'hashtags': inject(HashtagDB),
    'longTermGoals': inject(LongTermGoalDB),
    'quarterlyGoals': inject(QuarterlyGoalDB),
    'reflections': inject(ReflectionDB),
    'users': inject(UserDB),
    'weeklyGoals': inject(WeeklyGoalDB),
  };

  private user$ = toObservable(this.authDB.user);

  constructor(
    injector: Injector,
  ) { }

  /** Creates a unique id */
  createId(): string {
    // see https://stackoverflow.com/questions/56574593/access-firestore-id-generator-on-the-front-end?noredirect=1&lq=1
    // see https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36
    // Alphanumeric characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }

  afUser(): Observable<User> {
    return this.user$;
  }

  login(providerId, scope?: string): any {
    this.authDB.login();
  }

  loginLink(error) { }

  logout() {
    this.authDB.logout();
  }

  streamEntity<T>(collectionName: string, id: string, injector: Injector) {
    const store = this.DB[collectionName];
    const entity = computed(() => {
      return store.selectEntity(id);
    });
    return toObservable(entity, { injector });
  }

  streamEntities<T>(collectionName, queryParams, queryOptions, injector: Injector) {
    const store = this.DB[collectionName];
    const entities = computed(() => {
      return store.selectEntities(queryParams, queryOptions);
    });
    return toObservable(entities, { injector });
  }
  
  streamEntitiesChanges<T>(collectionName, queryParams, queryOptions, injector: Injector) {
    const store = this.DB[collectionName];
    const streamEntities = computed(() => {
      return store.selectEntities(queryParams, queryOptions);
    });

    return toObservable(streamEntities, { injector }).pipe(
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
              docData: currEntities[key],
            });
          } else if (currEntities[key]['_deleted']) {
          // the entity was removed
            changedEntities.push({
              type: 'removed',
              docData: currEntities[key],
            });
          } else if (currEntities[key]['_updatedAt'] !== prevEntities[key]['_updatedAt']) {
          // the entity was modified
            changedEntities.push({
              type: 'modified',
              docData: currEntities[key],
            });
          }
        }

        return changedEntities;
      }),
      filter((changes: Array<{ type: string, docData: AnyEntity }>) => changes.length > 0),
    );
  }

  async getEntity<T>(collectionName: string, id: string) {
    const store = this.DB[collectionName];
    return store.selectEntity(id);
  }

  async getEntities<S>(
    collectionName: string,
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
  ): Promise<S[]> {
    const store = this.DB[collectionName];
    return store.selectEntities(queryParams, queryOptions);
  }

  async count(
    collectionName: string,
    queryParams: QueryParams,
    queryOptions?: QueryOptions,
  ): Promise<number> {
    const result = await this.aggregate(collectionName, queryParams, queryOptions, {
      count: ['count'],
    });
    return result.count;
  }

  /*
   * Example of aggregateSpec
   * {
   *   countOfDocs: ['count'],
   *   totalPopulation: ['sum', 'population'],
   *   averagePopulation: ['average', 'population'],
   * }
   */
  async aggregate<S extends { [k: string]: number }>(
    collectionName: string,
    queryParams: QueryParams,
    queryOptions: QueryOptions,
    aggregateSpec: { [K in keyof S]: [string] | [string, string] },
  ): Promise<{ [K in keyof S]: number }> {
    const store = this.DB[collectionName];
    const entities = store.selectEntities(queryParams, queryOptions);
    let result: Partial<{ [K in keyof S]: number }> = {};
    for (let key in aggregateSpec) {
      let value = aggregateSpec[key];

      if (value[0] === 'count') {
        result[key] = entities.length;
      } else if (value[0] === 'sum') {
        result[key] = entities.reduce((s, e) => s + e[value[1]], 0);
      } else if (value[0] === 'average') {
        result[key] = entities.reduce((s, e) => s + e[value[1]], 0)/entities.length;
      }
    }
    return result as { [K in keyof S]: number };
  }

  async addEntity(collectionName, entity) {
    const store = this.DB[collectionName];
    return await store.add(Object.assign({}, entity, {
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    }));

  }

  async updateEntity(collectionName, id, changes) {
    const store = this.DB[collectionName];
    const entity = store.selectEntity(id);
    return await store.update(id, Object.assign({}, changes, {
      _updatedAt: Timestamp.now(),
    }));
  }

  async removeEntity(collectionName, id) {
    const store = this.DB[collectionName];
    const entity = store.selectEntity(id);
    let changes = {
      _updatedAt: Timestamp.now(),
      _deleted: true,
    };

    return await store.update(id, changes);
  }

  async incrementEntityField(collectionName, id, field, delta) {
    const store = this.DB[collectionName];
    const entity = store.selectEntity(id);
    let changes = {
      _updatedAt: Timestamp.now(),
    };
    changes[field] = entity[field] + delta;

    return await store.update(id, changes);
  }
}
