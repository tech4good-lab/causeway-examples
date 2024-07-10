import { Timestamp } from '@angular/fire/firestore';
import { User, AccessState } from '../../store/user/user.model';

export const USER_DB: User[] = [
  {
    __id: '1',
    email: 'a@sample.com',
    name: 'User A',
    photoURL: 'http://loremflickr.com/100/100',
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
    __id: '2',
    email: 'b@sample.com',
    name: 'User Bob',
    photoURL: 'http://loremflickr.com/100/100',
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
  {
    __id: '3',
    email: 'c@sample.com',
    name: 'User C',
    photoURL: 'http://loremflickr.com/100/100',
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
  },
];
