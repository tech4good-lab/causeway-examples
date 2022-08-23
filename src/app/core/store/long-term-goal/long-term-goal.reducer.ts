import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { LongTermGoal } from './long-term-goal.model';
import { LongTermGoalActions, LongTermGoalActionTypes } from './long-term-goal.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface State extends EntityState<LongTermGoal> {
  // additional entities state properties
}

export const adapter: EntityAdapter<LongTermGoal> = createEntityAdapter<LongTermGoal>({
  selectId: (longTermGoal: LongTermGoal) => longTermGoal.__id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export function reducer(
  state: State = initialState,
  action: LongTermGoalActions,
) {
  switch (action.type) {
    case LongTermGoalActionTypes.ADDED:
      return adapter.upsertOne(action.payload, state);

    case LongTermGoalActionTypes.LOADED:
      return adapter.upsertMany(action.payload, state);

    case LongTermGoalActionTypes.MODIFIED:
      return adapter.updateOne({
        id: action.payload.__id,
        changes: action.payload,
      }, state);

    case LongTermGoalActionTypes.REMOVED:
      return adapter.removeOne(action.payload.__id, state);

    default:
      return state;
  }
}

export const getLongTermGoalState = createFeatureSelector<State>('longTermGoal');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getLongTermGoalState);
