import { Injectable } from '@angular/core';
import { from, of, combineLatest, merge, Observable, ConnectableObservable, BehaviorSubject } from 'rxjs';
import { switchMap, mergeMap, skip, delay, filter, tap, scan, publishReplay, refCount, shareReplay, map, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../store/app.reducer';
import { MockDBService } from './mock-db.service';

// Entity Models
import { WeekGoal } from '../store/week-goal/week-goal.model';
import { Week } from '../store/week/week.model';
import { CalendarEvent } from '../store/calendar-event/calendar-event.model';
import { User } from '../store/user/user.model';
import { Quarter } from '../store/quarter/quarter.model';
import { QuarterGoal } from '../store/quarter-goal/quarter-goal.model';
import { LongTermGoal } from '../store/long-term-goal/long-term-goal.model';

export interface MockDBChanges {
  [id: string]: BehaviorSubject<
    Array<{ type: string; result: any; original?: any }>
  >;
}

export interface MockDB {
  [id: string]: Observable<{ [id: string]: any }>;
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  mockDB: MockDB;
  mockDBChanges: MockDBChanges;
  mockAfUser: any;

  // Constant for simulating delay (e.g. to see loading icon in action)
  LATENCY_SIMULATION_DELAY = 2000;

  reducer = (entities, changes) => {
    for (const c of changes) {
      switch (c.type) {
        case 'added':
          entities[c.result.__id] = c.result;
          break;
        case 'modified':
          entities[c.result.__id] = Object.assign(
            {},
            entities[c.result.__id],
            c.result
          );
          break;
        case 'removed':
          delete entities[c.result.__id];
          break;
      }
    }

    return entities;
  };

  constructor(
    private store: Store<fromStore.State>,
    private mockDBService: MockDBService
  ) {
    this.mockAfUser = new BehaviorSubject<any>(undefined);

    // Essentially mocking stateChanges in Firebase
    this.mockDBChanges = {
      // Entity Models
      weekGoals: new BehaviorSubject<Array<{ type: string; result: WeekGoal }>>(
        this.mockDBService.getInitialDBStateChanges('weekGoals')
      ),
      weeks: new BehaviorSubject<Array<{ type: string; result: Week }>>(
        this.mockDBService.getInitialDBStateChanges('weeks')
      ),
      calendarEvents: new BehaviorSubject<Array<{ type: string; result: CalendarEvent }>>(
        this.mockDBService.getInitialDBStateChanges('calendarEvents')
      ),
      users: new BehaviorSubject<Array<{ type: string; result: User }>>(
        this.mockDBService.getInitialDBStateChanges('users')
      ),
      quarters: new BehaviorSubject<Array<{ type: string; result: Quarter }>>(
        this.mockDBService.getInitialDBStateChanges('quarters')
      ),
      quarterGoals: new BehaviorSubject<Array<{ type: string; result: QuarterGoal }>>(
        this.mockDBService.getInitialDBStateChanges('quarterGoals')
      ),
      longTermGoals: new BehaviorSubject<Array<{ type: string; result: LongTermGoal }>>(
        this.mockDBService.getInitialDBStateChanges('longTermGoals')
      ),
    };

    // Create the mockDB (valueChanges) by scanning the stateChanges
    this.mockDB = {};
    for (const collection in this.mockDBChanges) {
      if (this.mockDBChanges.hasOwnProperty(collection)) {
        const valChangeObs$ = this.mockDBChanges[collection].pipe(
          scan(this.reducer, {}),
          publishReplay(1)
        ) as ConnectableObservable<any>;

        // Connect now rather than waiting for first subscription otherwise could miss initial values
        valChangeObs$.connect();
        this.mockDB[collection] = valChangeObs$;
      }
    }

    // Auto login if applicable
    const afUser = this.mockDBService.currentUser();
    this.mockAfUser.next(afUser);
    this.loadCurrentUserData(afUser);
  }

  public createId = () => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  };

  afUser = () => {
    return this.mockAfUser.asObservable();
  };

  private loadCurrentUserData = (afUser) => {
    for (const collection in this.mockDBChanges) {
      if (this.mockDBChanges.hasOwnProperty(collection)) {
        this.mockDBChanges[collection].next(
          this.mockDBService.getCurrentUserDBStateChanges(
            collection,
            afUser.uid
          )
        );
      }
    }
  };

  login = (providerId, scope?: string): Observable<any> => {
    const afUser = this.mockDBService.currentUser();
    this.mockAfUser.next(afUser);
    this.loadCurrentUserData(afUser);

    return of({
      credential: { providerId, accessToken: 'faketoken' },
      user: afUser,
    }).pipe(
      mergeMap((results) => {
        return this.queryObjOnce<User>('users', results.user.uid).pipe(
          map((dbUser) => Object.assign({}, results, { dbUser }))
        );
      })
    );
  };

  loginLink = (error) => {
    return;
  };

  queryObjValueChanges = <T>(collection: string, id: string) => {
    return this.mockDB[collection].pipe(map((entities) => entities[id]));
  };

  queryObjOnce<S>(collection: string, id: string): Observable<S>;

  queryObjOnce<S, T>(
    collection: string,
    id: string,
    childrenFn?: (e: S) => { [index: string]: Observable<any> }
  ): Observable<T>;

  queryObjOnce<S, T>(
    collection: string,
    id: string,
    childrenFn?: (e: S) => { [index: string]: Observable<any> }
  ): Observable<T> {
    return this.queryObjValueChanges<S>(collection, id).pipe(
      take(1),
      switchMap((e) => {
        if (!e || !childrenFn) {
          return of(e);
        } else {
          const children = childrenFn(e);
          // transform the hash of observables into an array of observable hashes
          const obsArray = Object.keys(children).map((objKey) => {
            const obs = children[objKey];
            return obs.pipe(
              map((entity) => {
                const obj = {};
                obj[objKey] = entity;
                return obj;
              })
            );
          });
          return obsArray.length === 0
            ? of(e)
            : combineLatest(obsArray).pipe(
                map((array) => {
                  return Object.assign({}, e, ...array);
                })
              );
        }
      })
    );
  }

  queryListStateChanges = <T>(
    collection,
    queryParams,
    queryOptions?
  ): Observable<Array<{ type: string; result: T; original?: T }>> => {
    if (queryParams.length === 0) {
      return this.queryListValueChanges<T>(
        collection,
        queryParams,
        queryOptions
      ).pipe(
        take(1),
        mergeMap((entities) => {
          return merge(
            of(entities.map((e) => ({ type: 'added', result: e }))),
            this.mockDBChanges[collection].asObservable().pipe(skip(1))
          );
        })
      );
    } else {
      return this.queryListValueChanges<T>(
        collection,
        queryParams,
        queryOptions
      ).pipe(
        take(1),
        mergeMap((entities) => {
          return merge(
            of(entities.map((e) => ({ type: 'added', result: e }))),
            this.mockDBChanges[collection].asObservable().pipe(
              skip(1),
              map((changes) => {
                // Filter out changes relevant for our query
                return changes.filter((change) => {
                  // We need to check if the query filters match the entity being changed. For a 'modified'
                  // change, we need to check a match on either the original or updated entity
                  const toCheck = [change.result];
                  if (change.type === 'modified') {
                    toCheck.push(change.original);
                  }

                  // Looks for the first failed filter. If there exists any,
                  // return false (filter it out)
                  return !queryParams.find((f) => {
                    const [key, rel, val] = f;

                    // currently, we handle '==' and 'in'.
                    switch (rel) {
                      case '==':
                        return !toCheck.find((e) => val === e[key]);

                      case 'in':
                        return !toCheck.find((e) =>
                          val.find((v) => e[key] === v)
                        );

                      default:
                        return false;
                    }
                  });
                });
              })
            )
          );
        })
      );
    }
  };

  queryListValueChanges = <T>(
    collection,
    queryParams,
    queryOptions?
  ): Observable<T[]> => {
    return this.mockDB[collection].pipe(
      map((entities) => {
        let filteredEntities = [];

        // If the first entry is filtering by '__id', we process that first
        // since it is more efficient. Otherwise, start with the full list.
        if (queryParams && queryParams[0] && queryParams[0][0] === '__id') {
          switch (queryParams[0][1]) {
            case '==': {
              filteredEntities.push(entities[queryParams[0][2]]);
              break;
            }
            case 'in': {
              // We are using loop syntax instead of map so that we can exit
              // early if a desired entity has not been loaded into store.
              const uniqueIds = queryParams[0][2].filter(
                (x, i, a) => a.indexOf(x) === i
              );
              for (const id of uniqueIds) {
                if (!entities[id]) {
                  return undefined;
                } else {
                  filteredEntities.push(entities[id]);
                }
              }
              break;
            }
          }
        } else {
          filteredEntities = Object.keys(entities).map((id) => entities[id]);
        }

        if (queryParams) {
          // Then process the remaining filters.
          filteredEntities = filteredEntities.filter((e) => {
            // Looks for the first failed filter. If there exists any,
            // return false (filter it out)
            return !queryParams.find((f) => {
              const [key, rel, val] = f;

              // already processed '__id' so always passes this filter
              if (key === '__id') {
                return false;
              }

              // currently, we handle '==' and 'in'.
              switch (rel) {
                case '==':
                  return !(val === e[key]);

                case 'in':
                  return !val.find((v) => e[key] === v);

                default:
                  return false;
              }
            });
          });
        }

        return filteredEntities;
      })
    );
  };

  queryListOnce<S>(
    collection: string,
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any }
  ): Observable<S[]>;

  queryListOnce<S, T>(
    collection: string,
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: S) => { [index: string]: Observable<any> }
  ): Observable<T[]>;

  queryListOnce<S, T>(
    collection: string,
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: S) => { [index: string]: Observable<any> }
  ): Observable<T[]> {
    return this.queryListValueChanges<S>(
      collection,
      queryParams,
      queryOptions
    ).pipe(
      take(1),
      switchMap((entities) => {
        if (!entities || !childrenFn || entities.length === 0) {
          return of(entities);
        } else {
          return combineLatest(
            entities.map((e) => {
              // If there are children, then we need to transform the hash of observables into an observable with the data object
              const children = childrenFn(e);

              const obsArray = Object.keys(children).map((objKey) => {
                const obs = children[objKey];
                return obs.pipe(
                  map((entity) => {
                    const obj = {};
                    obj[objKey] = entity;
                    return obj;
                  })
                );
              });
              return obsArray.length === 0
                ? of(e)
                : combineLatest(obsArray).pipe(
                    map((array) => {
                      return Object.assign({}, e, ...array);
                    })
                  );
            })
          );
        }
      })
    );
  }

  addEntity = (collection, entity) => {
    this.mockDBChanges[collection].next([
      {
        type: 'added',
        result: entity,
      },
    ]);

    return of(undefined).pipe(
      delay(this.LATENCY_SIMULATION_DELAY),
    );
  };

  updateEntity = (collection, id, changes) => {
    return this.mockDB[collection].pipe(
      map((entities) => {
        const original = entities[id];
        return [original, Object.assign({}, original, changes)];
      }),
      take(1),
      tap(([original, entity]) => {
        this.mockDBChanges[collection].next([
          {
            type: 'modified',
            result: entity,
            original,
          },
        ]);
      }),
      map((entity) => undefined),
      delay(this.LATENCY_SIMULATION_DELAY),
    );
  };

  upsertEntity = (collection, entity): Observable<{ type: string, value: any }> => {
    return from((async () => {
      const dbEntity = await this.queryObjOnce(collection, entity.__id).toPromise();
      if (dbEntity) {
        return {
          type: 'update',
          value: await this.updateEntity(collection, entity.__id, entity),
        };
      } else {
        return {
          type: 'add',
          value: await this.addEntity(collection, entity),
        };
      }
    })());
  };

  removeEntity = (collection, id) => {
    return this.mockDB[collection].pipe(
      map((entities) => entities[id]),
      take(1),
      tap((entity) => {
        this.mockDBChanges[collection].next([
          {
            type: 'removed',
            result: entity,
          },
        ]);
      }),
      map((entity) => undefined),
      delay(this.LATENCY_SIMULATION_DELAY),
    );
  };
}
