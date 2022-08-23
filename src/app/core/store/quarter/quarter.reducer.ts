import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Quarter } from './quarter.model';
import { QuarterActions, QuarterActionTypes } from './quarter.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<Quarter> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Quarter> = createEntityAdapter<Quarter>({
  selectId: (quarter: Quarter) => quarter.__id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state: State = initialState,
  action: QuarterActions,
) {
  switch (action.type) {
    case QuarterActionTypes.ADDED:
      return adapter.upsertOne(action.payload, state);

    case QuarterActionTypes.LOADED:
      return adapter.upsertMany(action.payload, state);

    case QuarterActionTypes.MODIFIED:
      return adapter.updateOne({
        id: action.payload.__id,
        changes: action.payload,
      }, state);

    case QuarterActionTypes.REMOVED:
      return adapter.removeOne(action.payload.__id, state);

    default:
      return state;
  }
}

export const getQuarterState = createFeatureSelector<State>('quarter');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getQuarterState);
