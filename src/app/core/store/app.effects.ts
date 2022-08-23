import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { Actions, Effect, createEffect, ofType } from '@ngrx/effects';
import { of, Observable, merge } from 'rxjs';
import { tap, filter, mergeMap, map, first } from 'rxjs/operators';
import { pipe, forkJoin } from 'rxjs';
import { FirebaseService } from '../firebase/firebase.service';
import { Store, select } from '@ngrx/store';
import * as fromStore from './app.reducer';

import {
  GeneralActionTypes,
  Unsubscribe,
  ActionSetResult,
  ActionSet,
  ActionSetResponse,
  ActionFlow,
  RouterNavigate,
} from './app.actions';
import { CachedLoadConnectionsService } from './cached-load-connections.service';

@Injectable()
export class AppEffects {
  /** Process the router navigate action to use the Angular Router. */
  routerNavigate$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GeneralActionTypes.ROUTER_NAVIGATE),
        tap((action: RouterNavigate) => {
          this.router.navigate(action.commands, action.extras);
        })
      ),
    { dispatch: false }
  );

  /** Process the unsubscribe action. */
  unsubscribe$: Observable<Action> = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GeneralActionTypes.UNSUBSCRIBE),
        tap((action: Unsubscribe) => {
          this.cachedConnections.disconnect(action);
        })
      ),
    { dispatch: false }
  );

  /** Process a generic action flow. */
  actionFlow$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<ActionFlow>(GeneralActionTypes.ACTION_FLOW),
      // should have at least one action
      filter((af) => af.payload.actionSets.length > 0),
      mergeMap((actionFlow: ActionFlow) => {
        const responseFilters = [];

        // Set loading subject to true
        if (actionFlow.payload.loading$) {
          actionFlow.payload.loading$.next(true);
        }

        // Dispatch the primary actions and listen to the responses
        const responseObsArr = actionFlow.payload.actionSets.map((actionSet) => {
          // Set a correlationId
          const correlationId = this.db.createId();
          actionSet.action['correlationId'] = correlationId;

          // Dispatch the action
          this.store.dispatch(actionSet.action);

          // If no filter, then responseAction is undefined
          if (!actionSet.responseActionTypes) {
            return of(Object.assign({}, actionSet, {
              result: ActionSetResult.NONE,
              responseAction: undefined,
            }));
          } else {
            let successResponseTypeArr = [];
            if (Array.isArray(actionSet.responseActionTypes.success)) {
              successResponseTypeArr = actionSet.responseActionTypes.success;
            } else if (actionSet.responseActionTypes.success) {
              successResponseTypeArr = [actionSet.responseActionTypes.success];
            }

            let failureResponseTypeArr = [];
            if (Array.isArray(actionSet.responseActionTypes.failure)) {
              failureResponseTypeArr = actionSet.responseActionTypes.failure;
            } else if (actionSet.responseActionTypes.failure) {
              failureResponseTypeArr = [actionSet.responseActionTypes.failure];
            }

            const filterTypes = [
              ...successResponseTypeArr,
              ...failureResponseTypeArr,
            ];

            // listen for either success or fail action
            return this.actions$.pipe(
              ofType(...filterTypes),
              this.hasCorrelationId(correlationId),
              first(),
              map((responseAction) => {
                if (successResponseTypeArr.includes(responseAction.type)) {
                  return Object.assign({}, actionSet, {
                    result: ActionSetResult.SUCCESS,
                    responseAction,
                  });
                } else {
                  return Object.assign({}, actionSet, {
                    result: ActionSetResult.FAILURE,
                    responseAction,
                  });
                }
              }),
            );
          }
        });

        // Call successActionFn or failActionFn depending on the results
        // If no actions, we should run the success callback
        if (responseObsArr.length === 0) {
          // If there are no actions, just run the success callback
          if (actionFlow.payload.successActionFn) {
            return actionFlow.payload.successActionFn([]);
          } else {
            return [];
          }
        } else {
          return forkJoin(responseObsArr).pipe(
            mergeMap((actionSetResponses) => {
              // Set the loading subject to false
              if (actionFlow.payload.loading$) {
                actionFlow.payload.loading$.next(false);
              }

              // Figure out if it's a success or failure and emit the things necessary
              if (actionSetResponses.some((r) => r.result === ActionSetResult.FAILURE)) {
                // Emit all the callbacks for individual action sets
                const actionSetCallbacks = actionSetResponses.reduce((obs, asr) => {
                  if (!asr.callbacks) {
                    return obs;
                  } else if (asr.result === ActionSetResult.FAILURE && asr.callbacks.onFailure) {
                    return merge(obs, asr.callbacks.onFailure);
                  } else if (asr.result === ActionSetResult.SUCCESS && asr.callbacks.onSuccessButOtherFailure) {
                    return merge(obs, asr.callbacks.onSuccessButOtherFailure);
                  } else {
                    return obs;
                  }
                }, []);

                if (actionFlow.payload.failActionFn) {
                  return merge(actionSetCallbacks, actionFlow.payload.failActionFn(actionSetResponses));
                } else {
                  return actionSetCallbacks;
                }
              } else {
                if (actionFlow.payload.successActionFn) {
                  return actionFlow.payload.successActionFn(actionSetResponses);
                } else {
                  return [];
                }
              }
            }),
          );
        }
      }),
    ),
  );

  /** Filter to Actions with specified correlationId(s). */
  hasCorrelationId = <T extends Action>(correlationIds: string | string[]) =>
    pipe(
      // Use hash syntax since correlationId may not be defined on this Action
      filter<T>((origAction) => {
        if (!Array.isArray(correlationIds)) {
          return origAction['correlationId'] === correlationIds;
        } else {
          return correlationIds.includes(origAction['correlationId']);
        }
      })
    );

  constructor(
    private actions$: Actions,
    private router: Router,
    private cachedConnections: CachedLoadConnectionsService,
    private db: FirebaseService,
    private store: Store<fromStore.State>
  ) {}
}
