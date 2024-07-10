import { inject, Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '../../store/user/user.model';
import { UserContext } from '../../store/user-context/user-context.model';
import { Hashtag } from '../../store/hashtag/hashtag.model';
import { LongTermGoal } from '../../store/long-term-goal/long-term-goal.model';
import { QuarterlyGoal } from '../../store/quarterly-goal/quarterly-goal.model';
import { WeeklyGoal } from '../../store/weekly-goal/weekly-goal.model';
import { Reflection } from '../../store/reflection/reflection.model';
import { QueryParams, QueryOptions, AnyEntity } from '../../store/app.model';
import { withEntitiesForMockDB } from '../../store/app.store';
import { withEntities, setAllEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities, SelectEntityId } from '@ngrx/signals/entities';
import { signalStore, patchState, withState, withMethods, signalStoreFeature } from '@ngrx/signals';
import { USER_DB } from './user.data';
import { LONGTERMGOAL_DB } from './long-term-goal.data';
import { QUARTERLYGOAL_DB } from './quarterly-goal.data';
import { WEEKLYGOAL_DB } from './weekly-goal.data';
import { HASHTAG_DB } from './hashtag.data';
import { USERCONTEXT_DB } from './user-context.data';
import { REFLECTION_DB } from './reflection.data';

const selectId: SelectEntityId<AnyEntity> = (entity) => entity.__id;

export const AuthDB = signalStore(
  { providedIn: 'root' },
  withState({ user: null }),
  withMethods((store) => ({
    login() {
      patchState(store, { user: {
        uid: USER_DB[0].__id,
        email: USER_DB[0].email,
        displayName: USER_DB[0].name,
        photoURL: USER_DB[0].photoURL,
      } });
    },
    logout() {
      patchState(store, { user: null });
    },
  })),
);

// ENTITIES STORE
export const HashtagDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Hashtag>(),
);

export const LongTermGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<LongTermGoal>(),
);

export const QuarterlyGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<QuarterlyGoal>(),
);

export const ReflectionDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<Reflection>(),
);

export const UserDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<User>(),
);

export const UserContextDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<UserContext>(),
);

export const WeeklyGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesForMockDB<WeeklyGoal>(),
);

@Injectable({
  providedIn: 'root',
})
export class MockDBService {
  readonly hashtagDB = inject(HashtagDB);
  readonly longTermGoalDB = inject(LongTermGoalDB);
  readonly quarterlyGoalDB = inject(QuarterlyGoalDB);
  readonly reflectionDB = inject(ReflectionDB);
  readonly userDB = inject(UserDB);
  readonly userContextDB = inject(UserContextDB);
  readonly weeklyGoalDB = inject(WeeklyGoalDB);

  constructor() {
  }

  initDB() {
    patchState(this.userDB, setAllEntities(USER_DB, { selectId }));
    patchState(this.userContextDB, setAllEntities(USERCONTEXT_DB, { selectId }));
    patchState(this.reflectionDB, setAllEntities(REFLECTION_DB, { selectId }));
    patchState(this.quarterlyGoalDB, setAllEntities(QUARTERLYGOAL_DB, { selectId }));
    patchState(this.weeklyGoalDB, setAllEntities(WEEKLYGOAL_DB, { selectId }));
    patchState(this.hashtagDB, setAllEntities(HASHTAG_DB, { selectId }));
    patchState(this.longTermGoalDB, setAllEntities(LONGTERMGOAL_DB, { selectId }));
  }
}
