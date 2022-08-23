import { Action } from '@ngrx/store';
import { LoadAction } from '../app.actions';
import { Quarter } from './quarter.model';

export enum QuarterActionTypes {
  STREAM = '[Quarter] stream quarter',
  STREAM_SUCCESS = '[Quarter] stream quarter success',
  STREAM_FAIL = '[Quarter] stream quarter fail',
  LOAD = '[Quarter] load quarter',
  LOAD_SUCCESS = '[Quarter] load quarter success',
  LOAD_FAIL = '[Quarter] load quarter fail',
  ADD = '[Quarter] add quarter',
  ADD_SUCCESS = '[Quarter] add quarter success',
  ADD_FAIL = '[Quarter] add quarter fail',
  UPDATE = '[Quarter] update quarter',
  UPDATE_SUCCESS = '[Quarter] update quarter success',
  UPDATE_FAIL = '[Quarter] update quarter fail',
  REMOVE = '[Quarter] remove quarter',
  REMOVE_SUCCESS = '[Quarter] remove quarter success',
  REMOVE_FAIL = '[Quarter] remove quarter fail',
  LOADED = '[Quarter] loaded',
  ADDED = '[Quarter] added',
  MODIFIED = '[Quarter] modified',
  REMOVED = '[Quarter] removed',
}

// See Firebase Docs for current constraints on valid queries
export class StreamQuarter implements Action {
  readonly type = QuarterActionTypes.STREAM;
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
    public followupActions?: (quarter: Quarter) => LoadAction[],
  ) {}
}

export class StreamQuarterSuccess implements Action {
  readonly type = QuarterActionTypes.STREAM_SUCCESS;
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
    public followupActions?: (quarter: Quarter) => LoadAction[],
  ) {}
}

export class StreamQuarterFail implements Action {
  readonly type = QuarterActionTypes.STREAM_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}


export class LoadQuarter implements Action {
  readonly type = QuarterActionTypes.LOAD;
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
    public followupActions?: (quarter: Quarter) => LoadAction[],
  ) {}
}

export class LoadQuarterSuccess implements Action {
  readonly type = QuarterActionTypes.LOAD_SUCCESS;
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
    public followupActions?: (quarter: Quarter) => LoadAction[],
  ) {}
}

export class LoadQuarterFail implements Action {
  readonly type = QuarterActionTypes.LOAD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class AddQuarter implements Action {
  readonly type = QuarterActionTypes.ADD;
  constructor(
    public quarter: Quarter,
    public correlationId?: string,
  ) {}
}

export class AddQuarterSuccess implements Action {
  readonly type = QuarterActionTypes.ADD_SUCCESS;
  constructor(
    public quarter: Quarter,
    public correlationId?: string,
  ) {}
}

export class AddQuarterFail implements Action {
  readonly type = QuarterActionTypes.ADD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class UpdateQuarter implements Action {
  readonly type = QuarterActionTypes.UPDATE;
  constructor(
    public __id: string,
    public changes: Partial<Quarter>,
    public correlationId?: string,
  ) { }
}

export class UpdateQuarterSuccess implements Action {
  readonly type = QuarterActionTypes.UPDATE_SUCCESS;
  constructor(
    public __id: string,
    public changes: Partial<Quarter>,
    public correlationId?: string,
  ) {}
}

export class UpdateQuarterFail implements Action {
  readonly type = QuarterActionTypes.UPDATE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class RemoveQuarter implements Action {
  readonly type = QuarterActionTypes.REMOVE;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) { }
}

export class RemoveQuarterSuccess implements Action {
  readonly type = QuarterActionTypes.REMOVE_SUCCESS;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) {}
}

export class RemoveQuarterFail implements Action {
  readonly type = QuarterActionTypes.REMOVE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class LoadedQuarter implements Action {
  readonly type = QuarterActionTypes.LOADED;
  constructor(
    public payload: Quarter[],
    public correlationId?: string,
  ) {}
}

export class AddedQuarter implements Action {
  readonly type = QuarterActionTypes.ADDED;
  constructor(
    public payload: Quarter,
    public correlationId?: string,
  ) {}
}

export class ModifiedQuarter implements Action {
  readonly type = QuarterActionTypes.MODIFIED;
  constructor(
    public payload: Quarter,
    public correlationId?: string,
  ) {}
}

export class RemovedQuarter implements Action {
  readonly type = QuarterActionTypes.REMOVED;
  constructor(
    public payload: Quarter,
    public correlationId?: string,
  ) {}
}

export type QuarterActions =
  StreamQuarter |
  StreamQuarterSuccess |
  StreamQuarterFail |
  LoadQuarter |
  LoadQuarterSuccess |
  LoadQuarterFail |
  AddQuarter |
  AddQuarterSuccess |
  AddQuarterFail |
  UpdateQuarter |
  UpdateQuarterSuccess |
  UpdateQuarterFail |
  RemoveQuarter |
  RemoveQuarterSuccess |
  RemoveQuarterFail |
  LoadedQuarter |
  AddedQuarter |
  ModifiedQuarter |
  RemovedQuarter;
