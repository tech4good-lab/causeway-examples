import { Action } from '@ngrx/store';
import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model'; // ADDED
import { LongTermData } from './page.model'; // ADDED
//import { LongTermGoal } from './page.model';  // ADDED  Note: Use above instead
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
      longTermGoal: LongTermGoal, // ADDED
      currentUser: User,  // ADDED
      containerId: string;
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
