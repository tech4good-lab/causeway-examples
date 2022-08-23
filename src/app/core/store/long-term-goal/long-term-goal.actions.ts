import { Action } from '@ngrx/store';
import { LoadAction } from '../app.actions';
import { LongTermGoal } from './long-term-goal.model';

export enum LongTermGoalActionTypes {
  STREAM = '[LongTermGoal] stream longTermGoal',
  STREAM_SUCCESS = '[LongTermGoal] stream longTermGoal success',
  STREAM_FAIL = '[LongTermGoal] stream longTermGoal fail',
  LOAD = '[LongTermGoal] load longTermGoal',
  LOAD_SUCCESS = '[LongTermGoal] load longTermGoal success',
  LOAD_FAIL = '[LongTermGoal] load longTermGoal fail',
  ADD = '[LongTermGoal] add longTermGoal',
  ADD_SUCCESS = '[LongTermGoal] add longTermGoal success',
  ADD_FAIL = '[LongTermGoal] add longTermGoal fail',
  UPDATE = '[LongTermGoal] update longTermGoal',
  UPDATE_SUCCESS = '[LongTermGoal] update longTermGoal success',
  UPDATE_FAIL = '[LongTermGoal] update longTermGoal fail',
  UPSERT = '[LongTermGoal] upsert longTermGoal',
  UPSERT_SUCCESS = '[LongTermGoal] upsert longTermGoal success',
  UPSERT_FAIL = '[LongTermGoal] upsert longTermGoal fail',
  REMOVE = '[LongTermGoal] remove longTermGoal',
  REMOVE_SUCCESS = '[LongTermGoal] remove longTermGoal success',
  REMOVE_FAIL = '[LongTermGoal] remove longTermGoal fail',
  LOADED = '[LongTermGoal] loaded',
  ADDED = '[LongTermGoal] added',
  MODIFIED = '[LongTermGoal] modified',
  REMOVED = '[LongTermGoal] removed',
}

// See Firebase Docs for current constraints on valid queries
export class StreamLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.STREAM;
  constructor(
    // property, comparator, value
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (longTermGoal: LongTermGoal) => LoadAction[],
  ) {}
}

export class StreamLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.STREAM_SUCCESS;
  constructor(
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (longTermGoal: LongTermGoal) => LoadAction[],
  ) {}
}

export class StreamLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.STREAM_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}


export class LoadLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.LOAD;
  constructor(
    // property, comparator, value
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (longTermGoal: LongTermGoal) => LoadAction[],
  ) {}
}

export class LoadLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.LOAD_SUCCESS;
  constructor(
    public queryParams: [string, string, any][],
    public queryOptions: {
      orderBy?: string | [string, string],
      limit?: number,
      startAt?: string,
      startAfter?: string,
      endAt?: string,
      endBefore?: string,
    },
    public correlationId: string,
    public followupActions?: (longTermGoal: LongTermGoal) => LoadAction[],
  ) {}
}

export class LoadLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.LOAD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class AddLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.ADD;
  constructor(
    public longTermGoal: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class AddLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.ADD_SUCCESS;
  constructor(
    public longTermGoal: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class AddLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.ADD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class UpdateLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.UPDATE;
  constructor(
    public __id: string,
    public changes: Partial<LongTermGoal>,
    public correlationId?: string,
  ) { }
}

export class UpdateLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.UPDATE_SUCCESS;
  constructor(
    public __id: string,
    public changes: Partial<LongTermGoal>,
    public correlationId?: string,
  ) {}
}

export class UpdateLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.UPDATE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class UpsertLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.UPSERT;
  constructor(
    public longTermGoal: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class UpsertLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.UPSERT_SUCCESS;
  constructor(
    public longTermGoal: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class UpsertLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.UPSERT_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class RemoveLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.REMOVE;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) { }
}

export class RemoveLongTermGoalSuccess implements Action {
  readonly type = LongTermGoalActionTypes.REMOVE_SUCCESS;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) {}
}

export class RemoveLongTermGoalFail implements Action {
  readonly type = LongTermGoalActionTypes.REMOVE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class LoadedLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.LOADED;
  constructor(
    public payload: LongTermGoal[],
    public correlationId?: string,
  ) {}
}

export class AddedLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.ADDED;
  constructor(
    public payload: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class ModifiedLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.MODIFIED;
  constructor(
    public payload: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export class RemovedLongTermGoal implements Action {
  readonly type = LongTermGoalActionTypes.REMOVED;
  constructor(
    public payload: LongTermGoal,
    public correlationId?: string,
  ) {}
}

export type LongTermGoalActions =
  StreamLongTermGoal |
  StreamLongTermGoalSuccess |
  StreamLongTermGoalFail |
  LoadLongTermGoal |
  LoadLongTermGoalSuccess |
  LoadLongTermGoalFail |
  AddLongTermGoal |
  AddLongTermGoalSuccess |
  AddLongTermGoalFail |
  UpdateLongTermGoal |
  UpdateLongTermGoalSuccess |
  UpdateLongTermGoalFail |
  UpsertLongTermGoal |
  UpsertLongTermGoalSuccess |
  UpsertLongTermGoalFail |
  RemoveLongTermGoal |
  RemoveLongTermGoalSuccess |
  RemoveLongTermGoalFail |
  LoadedLongTermGoal |
  AddedLongTermGoal |
  ModifiedLongTermGoal |
  RemovedLongTermGoal;
