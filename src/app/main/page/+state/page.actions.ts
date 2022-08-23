import { Action } from '@ngrx/store';
import { User } from '../../../core/store/user/user.model';

export enum PageActionTypes {
  LOAD_DATA = '[Page] load data',
  CLEANUP = '[Page] cleanup',
}

/** Action for loading required DB data. */
export class LoadData implements Action {
  readonly type = PageActionTypes.LOAD_DATA;
  constructor(public correlationId: string) {}
}

/** Action for cleaning up loading subscriptions. */
export class Cleanup implements Action {
  readonly type = PageActionTypes.CLEANUP;
  constructor(public correlationId: string) {}
}

export type PageActions = LoadData | Cleanup;
