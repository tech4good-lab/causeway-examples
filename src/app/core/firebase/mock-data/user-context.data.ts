import { Timestamp } from '@angular/fire/firestore';
import { USER_DB } from './user.data';

export const USERCONTEXT_DB = [
  {
    __id: 'uc1',
    __userId: USER_DB[0].__id,
    background: {
      selections: ['option1'],
    },
    desiredValue: 'test',
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
];
