import { Injectable } from '@angular/core';
import { Subject, Observable, merge, forkJoin, of, from, pipe } from 'rxjs';
import { publishLast, publish, publishReplay, refCount, tap, pluck, mergeMap, filter, takeUntil, skipUntil, buffer, skip, switchMap, map, take } from 'rxjs/operators';
import { Actions, ofType } from '@ngrx/effects';
import { GeneralActionTypes, Unsubscribe, LoadAction } from './app.actions';
import { Action, Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import { FirebaseService } from '../firebase/firebase.service';
import { lowerCamelCase } from '../utils/string-case.utils';

export interface CachedConnection {
  loadKey: string;
  loadStream: Observable<Action>;
  correlationIds: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CachedLoadConnectionsService {
  /** Cached connections by correlationId. */
  private connectionsByCorrelationId: { [cId: string]: CachedConnection[] } =
    {};

  /** Cached connections by loadKey. */
  private connectionByLoadKey: { [loadKey: string]: CachedConnection } = {};

  /** Close connection events. */
  private closeConnection$: Subject<string> = new Subject<string>();

  /** Load ready events. */
  private loadReady$: Subject<string> = new Subject<string>();

  /**
   * Get entityName and collection from action.
   * TODO: Fragile: depends on correct syntax for type
   */
  private getActionAttributes(action: LoadAction): [string, string] {
    const l = action.type.indexOf('[');
    const r = action.type.indexOf(']');
    const entityName = action.type.slice(l + 1, r);
    const collection = lowerCamelCase(entityName) + 's';
    return [entityName, collection];
  }

  /**
   * Function to determine whether it is a Stream action or a Load action.
   * TODO: Fragile: depends on correct syntax for type
   */
  public isStream(action: LoadAction): boolean {
    const [entityName, collection] = this.getActionAttributes(action);
    if (action.type.indexOf(`[${entityName}] stream`) === -1) {
      return false;
    } else {
      return true;
    }
  }
  /** Define a unique key for each connection. */
  private getLoadKey(action: LoadAction): string {
    let queryOptionsString = '';
    if (action.queryOptions) {
      if (action.queryOptions.orderBy) {
        queryOptionsString = queryOptionsString.concat(`orderBy${action.queryOptions.orderBy}`);
      }
      if (action.queryOptions.limit) {
        queryOptionsString = queryOptionsString.concat(`limit${action.queryOptions.limit}`);
      }
      if (action.queryOptions.startAt) {
        queryOptionsString = queryOptionsString.concat(`startAt${action.queryOptions.startAt}`);
      }
      if (action.queryOptions.startAfter) {
        queryOptionsString = queryOptionsString.concat(`startAfter${action.queryOptions.startAfter}`);
      }
      if (action.queryOptions.endAt) {
        queryOptionsString = queryOptionsString.concat(`endAt${action.queryOptions.endAt}`);
      }
      if (action.queryOptions.endBefore) {
        queryOptionsString = queryOptionsString.concat(`endBefore${action.queryOptions.endBefore}`);
      }
    }
    const [entityName, collection] = this.getActionAttributes(action);
    return `${entityName}.${action.queryParams}.${queryOptionsString}`;
  }

  /** Gets a cached connection if one exists.  */
  private getConnection(action: LoadAction): CachedConnection {
    const loadKey = this.getLoadKey(action);
    return this.connectionByLoadKey[loadKey];
  }

  /**
   * Disconnects all "virtual" connections with that correlationId.
   * For connections where this correlationId was the only one, disconnect
   * it in actuality.
   */
  public disconnect(action: Unsubscribe) {
    // console.log("PROCESS DISCONNECT: " + action.correlationId);

    // Add a 5-second delay so we don't have to reconnect multiple times
    // if the next view happens to use the same loading
    setTimeout(() => {
      const correlationId = action.correlationId;
      const connections = this.connectionsByCorrelationId[correlationId];

      // If there are no connections, just return
      if (!connections) {
        return;
      }

      while (connections.length > 0) {
        const c = connections.pop();

        // Remove the correlationId from the list in that connection
        const index = c.correlationIds.findIndex(
          (cId) => cId === correlationId
        );
        c.correlationIds.splice(index, 1);
        // If there are no more correlationIds, then dispatch close connection for that particular connection
        if (c.correlationIds.length === 0) {
          this.closeConnection$.next(c.loadKey);

          // Update connectionByLoadKey
          this.connectionByLoadKey[c.loadKey] = undefined;
        }
      }
    }, 5000);
  }

  /**
   * Main function called by the outside. Some notes:
   * -- followupActions are only computed for initial loads and adds. They
   *    are not recomputed if the fields that are being used change
   */
  public processLoadAction(
    action: LoadAction,
    isFollowup: boolean = false,
    initiatingAction?: LoadAction,
    loadWaitingQueue?: string[]
  ): CachedConnection {
    // console.log("PROCESS LOAD: " + this.getLoadKey(action));

    // Check whether this action is to just load once or create an open connection
    const keepConnected: boolean = this.isStream(action);

    // Set initiating action if needed
    if (!isFollowup) {
      initiatingAction = action;
      loadWaitingQueue = [];
    }

    let connection;

    // If we're just loading once, then we don't need all the caching logic
    if (!keepConnected) {
      connection = this.createSingleLoadConnection(action, initiatingAction);
    } else {
      // get connection and process the immediate load connection required
      connection = this.getConnection(action);

      if (connection) {
        // if the connection already exists, don't need to create a new load connection,
        // but may need to add the correlationId if it doesn't already exist
        if (
          !connection.correlationIds.some((cId) => cId === action.correlationId)
        ) {
          connection.correlationIds.push(action.correlationId);
          this.connectionsByCorrelationId[action.correlationId] =
            this.connectionsByCorrelationId[action.correlationId] || [];
          this.connectionsByCorrelationId[action.correlationId].push(
            connection
          );
        }
      } else {
        // if the connection does not exist, create it
        connection = this.createConnection(action, initiatingAction);
        this.connectionByLoadKey[connection.loadKey] = connection;
        this.connectionsByCorrelationId[action.correlationId] =
          this.connectionsByCorrelationId[action.correlationId] || [];
        this.connectionsByCorrelationId[action.correlationId].push(connection);
      }
    }
    // indicator that we're making another connection and waiting for firebase response
    if (loadWaitingQueue) {
      loadWaitingQueue.push('waiting');
    }

    let followupStream$;

    if (!keepConnected) {
      followupStream$ = connection.loadStream.pipe(take(1));
    } else {
      followupStream$ = connection.loadStream;
    }
    followupStream$.subscribe((fbPayload: any) => {
      if (fbPayload.type === 'initial' || fbPayload.type === 'load') {
        // process the followupActions
        if (action.followupActions) {
          for (const entity of fbPayload.results) {
            const followupLoadActions = action.followupActions(entity);
            for (const fAction of followupLoadActions) {
              this.processLoadAction(
                fAction,
                true,
                initiatingAction,
                loadWaitingQueue
              );
            }
          }
        }
        if (fbPayload.type === 'initial' && loadWaitingQueue) {
          loadWaitingQueue.pop();
          if (loadWaitingQueue.length === 0) {
            console.log('READY!');
            // Note: if there's some strange reason you have a nested query that
            // is exactly the same as the original query, it could trigger early
            this.loadReady$.next(this.getLoadKey(initiatingAction));
          }
        }
      } else if (fbPayload.type === 'added') {
        if (action.followupActions) {
          const entity = fbPayload.result;
          const followupLoadActions = action.followupActions(entity);
          for (const fAction of followupLoadActions) {
            this.processLoadAction(
              fAction,
              true,
              initiatingAction,
              loadWaitingQueue
            );
          }
        }
      }
    });

    return connection;
  }

  private createSingleLoadConnection(
    action: LoadAction,
    initiatingAction: LoadAction
  ): CachedConnection {
    // Unlike the createConnection logic, we don't need a disconnectObs$ since
    // we aren't keeping a persistent stream

    // ------------ DISPATCH ACTIONS ONLY AFTER START DISPATCH EMITS ------------------
    // When loadReady$ for the initiatingAction, we can startDispatching$ since all connections
    // have had responses from Firebase
    const initiatingLoadKey = this.getLoadKey(initiatingAction);
    const startDispatching$ = this.loadReady$.pipe(
      filter((lk) => lk === initiatingLoadKey),
      take(1)
    );

    // Define the raw stream
    const [entityName, collection] = this.getActionAttributes(action);
    const rawStream$ = this.db
      .queryListValueChanges(
        collection,
        action.queryParams,
        action.queryOptions
      )
      .pipe(
        map((results) => {
          return { type: 'initial', results };
        }),
        // Is this 2 or 1? There is that issue with cached values that could be a problem still...
        take(1)
      );

    // Once startDispatching emits, we can start dispatching
    forkJoin([startDispatching$, rawStream$])
      .pipe(
        map(([_, fbPayload]) => {
          return fbPayload;
        }),
        take(1)
      )
      .subscribe((fbPayload) => {
        this.store.dispatch({
          type: `[${entityName}] loaded`,
          payload: fbPayload.results,
          correlationId: action.correlationId,
        });
      });

    // Return a replayed version for followupActions
    const stream$ = rawStream$.pipe(publishReplay(1), refCount());

    // We're returning it in this form just so processLoadAction can be defined generally
    return {
      loadKey: null,
      loadStream: stream$,
      correlationIds: [],
    };
  }

  private createConnection(
    action: LoadAction,
    initiatingAction: LoadAction
  ): CachedConnection {
    // console.log("CONNECT " + this.getLoadKey(action));
    // ------------ DEFINE OBSERVABLES FOR DISCONNECTING AND DISPATCHING --------------

    const loadKey = this.getLoadKey(action);
    const disconnectObs$ = this.closeConnection$.pipe(
      filter((lk) => lk === loadKey),
      take(1),
      // tap(a => { console.log("DISCONNECT: " + loadKey) }),
      publish(),
      refCount()
    );

    // When loadReady$ for the initiatingAction, we can startDispatching$ since all connections
    // have had responses from Firebase
    const initiatingLoadKey = this.getLoadKey(initiatingAction);
    const startDispatching$ = this.loadReady$.pipe(
      filter((lk) => lk === initiatingLoadKey),
      take(1),
      // tap(a => { console.log("START DISPATCHING: " + initiatingLoadKey) }),
      publish(),
      refCount()
    );

    // ------------ MULTICAST THE RAW ACTION STREAM -----------------------------------

    const [entityName, collection] = this.getActionAttributes(action);

    // Create a multicasted stream emitting until disonnectObs$ fires
    const rawStream$ = this.loadStream(collection, action).pipe(
      takeUntil(disconnectObs$),
      publishReplay(1),
      refCount()
    );

    // ------------ DISPATCH ACTIONS ONLY AFTER START DISPATCH EMITS ------------------

    // This buffers the stream of actions until startDispatching$ fires
    const bufferedStream$ = rawStream$.pipe(
      buffer(startDispatching$),
      take(1),
      mergeMap((array) => array),
      takeUntil(disconnectObs$)
    );

    // This stores the stream of actions after buffering is finished
    const postBufferedStream$ = rawStream$.pipe(
      skipUntil(startDispatching$),
      takeUntil(disconnectObs$)
    );
    // Merge the buffered and post-buffered streams together and dispatch actions
    merge(bufferedStream$, postBufferedStream$)
      .pipe(takeUntil(disconnectObs$))
      .subscribe((fbPayload) => {
        if (fbPayload.type === 'initial' || fbPayload.type === 'load') {
          this.store.dispatch({
            type: `[${entityName}] loaded`,
            payload: fbPayload.results,
            correlationId: action.correlationId,
          });
        } else {
          this.store.dispatch({
            type: `[${entityName}] ${fbPayload.type}`,
            payload: fbPayload.result,
            correlationId: action.correlationId,
          });
        }
      });

    // ------------ REPLAY ONLY THE INITIAL/LOAD/ADD ACTIONS --------------------------

    // multicast the WHOLE stream of initial and added actions. This is so that "followupActions" in future
    // loads also works. Don't need to replay "modify" actions since this will store way too many actions.
    // takeUntil is required both before (defined in rawStream$) and after publishReplay
    // to make sure both the connection to firebase stops as well as subscriptions to the multicasted observable
    const stream$ = rawStream$.pipe(
      filter(
        (fbPayload: any) =>
          fbPayload.type === 'initial' ||
          fbPayload.type === 'load' ||
          fbPayload.type === 'added'
      ),
      publishReplay(),
      refCount(),
      takeUntil(disconnectObs$)
    );

    return {
      loadKey: this.getLoadKey(action),
      loadStream: stream$,
      correlationIds: [action.correlationId],
    };
  }

  // Returns an observable with the initial as a list
  // and the remainder as deltas
  private loadStream = (
    collection: string,
    action: LoadAction
  ): Observable<{ type: string; results?: any; result?: any }> => {
    const queryParams = action.queryParams;
    const queryOptions = action.queryOptions;

    const loadKey = this.getLoadKey(action);
    const disconnectObs$ = this.closeConnection$.pipe(
      filter((lk) => lk === loadKey),
      take(1)
    );
    return this.db
      .queryListValueChanges(collection, queryParams, queryOptions)
      .pipe(
        take(1),
        mergeMap((results) => {
          return merge(
            of({ type: 'initial', results }),
            this.db
              .queryListStateChanges(collection, queryParams, queryOptions)
              .pipe(
                skip(1),
                // results is an array of state changes.
                mergeMap((changeResults: any[]) => {
                  // group 'added' actions together to load simultaneously into store
                  const addedResults = changeResults
                    .filter((r) => r.type === 'added')
                    .map((r) => r.result);

                  // group remaining actions together
                  const otherResults = changeResults.filter(
                    (r) => r.type !== 'added'
                  );

                  return [
                    { type: 'load', results: addedResults },
                    ...otherResults,
                  ];
                })
              ) as Observable<{ type: string; results?: any; result?: any }>
          );
        }),
        takeUntil(disconnectObs$)
      );
  };

  constructor(
    private actions$: Actions,
    private store: Store<fromStore.State>,
    private db: FirebaseService
  ) {}
}
