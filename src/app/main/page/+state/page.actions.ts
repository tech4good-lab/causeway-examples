import { Action } from '@ngrx/store';
import { User } from '../../../core/store/user/user.model';

export enum PageActionTypes {
  LOAD_DATA = '[Page] load data',
  CLEANUP = '[Page] cleanup',
}

/** Action for loading required DB data. */
export class LoadData implements Action {
  readonly type = PageActionTypes.LOAD_DATA;

  constructor(
    public payload: {
      containerId: string;
      //quarterStartTime: number,
      //oneYear: string,
      //fiveYear: string,
      currentUser: User,
    }
  ) {}
}

/** Action for cleaning up loading subscriptions. */
export class Cleanup implements Action {
  readonly type = PageActionTypes.CLEANUP;
  constructor(
    public payload: {
      containerId: string;
    }
  ) {}
}

export type PageActions = LoadData | Cleanup;
