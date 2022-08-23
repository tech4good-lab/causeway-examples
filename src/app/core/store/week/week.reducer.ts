import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Week } from './week.model';
import { WeekActions, WeekActionTypes } from './week.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Week> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Week> = createEntityAdapter<Week>({
  selectId: (week: Week) => week.__id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state: State = initialState,
  action: WeekActions,
) {
  switch (action.type) {
    case WeekActionTypes.ADDED:
      return adapter.upsertOne(action.payload, state);

    case WeekActionTypes.LOADED:
      return adapter.upsertMany(action.payload, state);

    case WeekActionTypes.MODIFIED:
      return adapter.updateOne({
        id: action.payload.__id,
        changes: action.payload,
      }, state);

    case WeekActionTypes.REMOVED:
      return adapter.removeOne(action.payload.__id, state);

    default:
      return state;
  }
}

export const getWeekState = createFeatureSelector<State>('week');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getWeekState);
