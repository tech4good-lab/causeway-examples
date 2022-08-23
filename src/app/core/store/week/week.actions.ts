import { Action } from '@ngrx/store';
import { LoadAction } from '../app.actions';
import { Week } from './week.model';

export enum WeekActionTypes {
  STREAM = '[Week] stream week',
  STREAM_SUCCESS = '[Week] stream week success',
  STREAM_FAIL = '[Week] stream week fail',
  LOAD = '[Week] load week',
  LOAD_SUCCESS = '[Week] load week success',
  LOAD_FAIL = '[Week] load week fail',
  ADD = '[Week] add week',
  ADD_SUCCESS = '[Week] add week success',
  ADD_FAIL = '[Week] add week fail',
  UPDATE = '[Week] update week',
  UPDATE_SUCCESS = '[Week] update week success',
  UPDATE_FAIL = '[Week] update week fail',
  UPSERT = '[Week] upsert week',
  UPSERT_SUCCESS = '[Week] upsert week success',
  UPSERT_FAIL = '[Week] upsert week fail',
  REMOVE = '[Week] remove week',
  REMOVE_SUCCESS = '[Week] remove week success',
  REMOVE_FAIL = '[Week] remove week fail',
  LOADED = '[Week] loaded',
  ADDED = '[Week] added',
  MODIFIED = '[Week] modified',
  REMOVED = '[Week] removed',
}

// See Firebase Docs for current constraints on valid queries
export class StreamWeek implements Action {
  readonly type = WeekActionTypes.STREAM;
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
    public followupActions?: (week: Week) => LoadAction[],
  ) {}
}

export class StreamWeekSuccess implements Action {
  readonly type = WeekActionTypes.STREAM_SUCCESS;
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
    public followupActions?: (week: Week) => LoadAction[],
  ) {}
}

export class StreamWeekFail implements Action {
  readonly type = WeekActionTypes.STREAM_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}


export class LoadWeek implements Action {
  readonly type = WeekActionTypes.LOAD;
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
    public followupActions?: (week: Week) => LoadAction[],
  ) {}
}

export class LoadWeekSuccess implements Action {
  readonly type = WeekActionTypes.LOAD_SUCCESS;
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
    public followupActions?: (week: Week) => LoadAction[],
  ) {}
}

export class LoadWeekFail implements Action {
  readonly type = WeekActionTypes.LOAD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class AddWeek implements Action {
  readonly type = WeekActionTypes.ADD;
  constructor(
    public week: Week,
    public correlationId?: string,
  ) {}
}

export class AddWeekSuccess implements Action {
  readonly type = WeekActionTypes.ADD_SUCCESS;
  constructor(
    public week: Week,
    public correlationId?: string,
  ) {}
}

export class AddWeekFail implements Action {
  readonly type = WeekActionTypes.ADD_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class UpdateWeek implements Action {
  readonly type = WeekActionTypes.UPDATE;
  constructor(
    public __id: string,
    public changes: Partial<Week>,
    public correlationId?: string,
  ) { }
}

export class UpdateWeekSuccess implements Action {
  readonly type = WeekActionTypes.UPDATE_SUCCESS;
  constructor(
    public __id: string,
    public changes: Partial<Week>,
    public correlationId?: string,
  ) {}
}

export class UpdateWeekFail implements Action {
  readonly type = WeekActionTypes.UPDATE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class UpsertWeek implements Action {
  readonly type = WeekActionTypes.UPSERT;
  constructor(
    public week: Week,
    public correlationId?: string,
  ) {}
}

export class UpsertWeekSuccess implements Action {
  readonly type = WeekActionTypes.UPSERT_SUCCESS;
  constructor(
    public week: Week,
    public correlationId?: string,
  ) {}
}

export class UpsertWeekFail implements Action {
  readonly type = WeekActionTypes.UPSERT_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class RemoveWeek implements Action {
  readonly type = WeekActionTypes.REMOVE;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) { }
}

export class RemoveWeekSuccess implements Action {
  readonly type = WeekActionTypes.REMOVE_SUCCESS;
  constructor(
    public __id: string,
    public correlationId?: string,
  ) {}
}

export class RemoveWeekFail implements Action {
  readonly type = WeekActionTypes.REMOVE_FAIL;
  constructor(
    public error: any,
    public correlationId?: string,
  ) {}
}

export class LoadedWeek implements Action {
  readonly type = WeekActionTypes.LOADED;
  constructor(
    public payload: Week[],
    public correlationId?: string,
  ) {}
}

export class AddedWeek implements Action {
  readonly type = WeekActionTypes.ADDED;
  constructor(
    public payload: Week,
    public correlationId?: string,
  ) {}
}

export class ModifiedWeek implements Action {
  readonly type = WeekActionTypes.MODIFIED;
  constructor(
    public payload: Week,
    public correlationId?: string,
  ) {}
}

export class RemovedWeek implements Action {
  readonly type = WeekActionTypes.REMOVED;
  constructor(
    public payload: Week,
    public correlationId?: string,
  ) {}
}

export type WeekActions =
  StreamWeek |
  StreamWeekSuccess |
  StreamWeekFail |
  LoadWeek |
  LoadWeekSuccess |
  LoadWeekFail |
  AddWeek |
  AddWeekSuccess |
  AddWeekFail |
  UpdateWeek |
  UpdateWeekSuccess |
  UpdateWeekFail |
  UpsertWeek |
  UpsertWeekSuccess |
  UpsertWeekFail |
  RemoveWeek |
  RemoveWeekSuccess |
  RemoveWeekFail |
  LoadedWeek |
  AddedWeek |
  ModifiedWeek |
  RemovedWeek;
