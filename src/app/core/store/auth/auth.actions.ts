import { Action } from '@ngrx/store';
import { User } from '../user/user.model';

export const LOAD = '[Auth] load currentUser';
export const LOADED = '[Auth] loaded';

export class LoadAuth implements Action {
  readonly type = LOAD;
  constructor(public correlationId?: string) {}
}

export class LoadedAuth implements Action {
  readonly type = LOADED;
  constructor(
    public payload: {
      user: User;
    },
    public correlationId?: string
  ) {}
}

export type AuthActions = LoadAuth | LoadedAuth;
