import { Timestamp } from '@angular/fire/firestore';
import { USER_DB } from './user.data';

export const LONGTERMGOAL_DB = [
  {
    __id: 'ltg',
    __userId: USER_DB[0].__id,
    oneYear: 'Secure SWE or UX Engineering Internship',
    fiveYear: 'SWE with UX/Design/Animation oriented work',
  },
];
