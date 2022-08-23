import { Action } from '@ngrx/store';
import { ObservableInput, Subject } from 'rxjs';
import { NavigationExtras } from '@angular/router';

export interface SAction extends Action {
  payload: { [index: string]: any };
  correlationId?: string;
}

export interface LoadAction extends Action {
  queryParams: [string, string, any][];
  queryOptions?: {
    orderBy?: string | [string, string];
    limit?: number;
    startAt?: string;
    startAfter?: string;
    endAt?: string;
    endBefore?: string;
  };
  correlationId: string;
  followupActions?: (entity: any) => LoadAction[];
}

export enum GeneralActionTypes {
  UNSUBSCRIBE = '[General] unsubscribe',
  ROUTER_NAVIGATE = '[Router] navigate',
  ACTION_FLOW = '[General] action flow',
}

export enum ActionSetResult {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NONE = 'none', // was not tracked
}

export interface ActionSet {
  action: Action;
  responseActionTypes?: {
    success: string | string[];
    failure: string | string[];
  };
  // this can be used if you need to find a specific action set in the callback
  key?: string;
  callbacks?: {
    // Actions that should be dispatched if this one fails
    onFailure?: ObservableInput<Action>;
    // Action that should be dispatched if this one succeeds,
    // but some other Action in its actionSets batch fails
    onSuccessButOtherFailure?: ObservableInput<Action>;
  };
}

export interface ActionSetResponse extends ActionSet {
  result: ActionSetResult;
  responseAction: Action;
}

/**
 * An action that helps orchestrate a flow of actions
 * @param actionSets the group of actions to dispatch. Each set represents an action, the success action type, and the fail action type.
 * @param successActionFn a function executed if all actions are successful, and that returns an array of new actions to dispatch
 * @param failActionFn a function executed if any of the actions fail, and that returns an array of new actions to dispatch
 */
export class ActionFlow implements Action {
  readonly type = GeneralActionTypes.ACTION_FLOW;
  constructor(
    public payload: {
      actionSets: ActionSet[];
      loading$?: Subject<boolean>;
      successActionFn?: (
        actionSetResponses: ActionSetResponse[]
      ) => ObservableInput<Action>;
      failActionFn?: (
        actionSetResponses: ActionSetResponse[]
      ) => ObservableInput<Action>;
    }
  ) {}
}

export class Unsubscribe implements Action {
  readonly type = GeneralActionTypes.UNSUBSCRIBE;
  constructor(public correlationId?: string) {}
}

export class RouterNavigate implements Action {
  readonly type = GeneralActionTypes.ROUTER_NAVIGATE;
  constructor(public commands: any[], public extras?: NavigationExtras) {}
}

export type GeneralActions = Unsubscribe | ActionFlow | RouterNavigate;
