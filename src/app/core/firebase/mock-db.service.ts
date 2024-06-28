import { inject, Injectable } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { User } from '../store/user/user.model';
import { Hashtag } from '../store/hashtag/hashtag.model';
import { LongTermGoal } from '../store/long-term-goal/long-term-goal.model';
import { QuarterlyGoal } from '../store/quarterly-goal/quarterly-goal.model';
import { WeeklyGoal } from '../store/weekly-goal/weekly-goal.model';
import { Reflection } from '../store/reflection/reflection.model';
import { QueryParams, QueryOptions, AnyEntity } from '../store/app.model';
import { withEntitiesAndSelectMethods } from '../store/app.store';
import { withEntities, setAllEntities, removeEntity, updateEntity, setEntity, removeEntities, setEntities } from '@ngrx/signals/entities';
import { signalStore, patchState, withState, withMethods, signalStoreFeature } from '@ngrx/signals';

// AUTH STORE
const USER_1: User = {
  __id: 'test-user',
  name: 'Test User',
  email: 'test@sample.com',
  photoURL: 'http://placekitten.com/100/100',
}

export const AuthDB = signalStore(
  { providedIn: 'root' },
  withState({ user: null }),
  withMethods((store) => ({
    login() {
      patchState(store, { user: USER_1 });
    },
    logout() {
      patchState(store, { user: null });
    },
  }))
);

// ENTITIES STORE
export const HashtagDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<Hashtag>(),
);

export const LongTermGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<LongTermGoal>(),
);

export const QuarterlyGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<QuarterlyGoal>(),
);

export const ReflectionDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<Reflection>(),
);

export const UserDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<User>(),
);

export const WeeklyGoalDB = signalStore(
  { providedIn: 'root' },
  withEntitiesAndSelectMethods<WeeklyGoal>(),
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
  readonly weeklyGoalDB = inject(WeeklyGoalDB);
  
  constructor() {
  }

  initDB() {

    patchState(this.userDB, setAllEntities([
      {
        __id: '1',
        email: 'a@sample.com',
        name: 'User A',
        photoURL: 'http://placekitten.com/100/100',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: '2',
        email: 'b@sample.com',
        name: 'User Bob',
        photoURL: 'http://placekitten.com/100/100',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: '3',
        email: 'c@sample.com',
        name: 'User C',
        photoURL: 'http://placekitten.com/100/100',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
    ], { idKey: '__id' }));

    patchState(this.quarterlyGoalDB, setAllEntities([
      {
        __id: 'qg1',
        __userId: USER_1.__id,
        __hashtagId: 'ht1',
        text: 'Finish cover letters',
        completed: false,
        order: 1,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'qg2',
        __userId: USER_1.__id,
        __hashtagId: 'ht2',
        text: 'Apply to internships',
        completed: false,
        order: 2,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'qg3',
        __userId: USER_1.__id,
        __hashtagId: 'ht3',
        text: 'Technical interview prep!',
        completed: false,
        order: 3,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
    ], { idKey: '__id' }));
       
    patchState(this.weeklyGoalDB, setAllEntities([
      {
        __id: 'wg1',
        __userId: USER_1.__id,
        __quarterlyGoalId: 'qg1',
        __hashtagId: 'ht1',
        text: 'Finish Google cover letter',
        completed: false,
        order: 1,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'wg2',
        __userId: USER_1.__id,
        __quarterlyGoalId: 'qg2',
        __hashtagId: 'ht2',
        text: 'Apply to Microsoft',
        completed: false,
        order: 2,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'wg3',
        __userId: USER_1.__id,
        __quarterlyGoalId: 'qg3',
        __hashtagId: 'ht3',
        text: 'Review data structures',
        completed: false,
        order: 3,
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
    ], { idKey: '__id' }));


    patchState(this.hashtagDB, setAllEntities([
      {
        __id: 'ht1',
        name: '#coverletter',
        color: '#EE8B72',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'ht2',
        name: '#apply',
        color: '#2DBDB1',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      {
        __id: 'ht3',
        name: '#interview',
        color: '#FFB987',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
    ], { idKey: '__id' }));

    patchState(this.longTermGoalDB, setAllEntities([
      {
        __id: 'ltg',
        __userId: USER_1.__id,
        oneYear: 'Secure SWE or UX Engineering Internship',
        fiveYear: 'SWE with UX/Design/Animation oriented work',
      }
    ], { idKey: '__id' }));
  }
}
