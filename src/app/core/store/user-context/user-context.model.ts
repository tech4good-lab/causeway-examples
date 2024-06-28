import { Timestamp } from '@angular/fire/firestore';

export interface UserContext {
  __id: string;
  __userId: string;
  background: {
    selections: string[];
    other?: string;
  }
  desiredValue: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
