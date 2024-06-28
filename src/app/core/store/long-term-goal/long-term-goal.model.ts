import { Timestamp } from '@angular/fire/firestore';

export interface LongTermGoal {
  __id: string;
  __userId: string;
  oneYear: string;
  fiveYear: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
