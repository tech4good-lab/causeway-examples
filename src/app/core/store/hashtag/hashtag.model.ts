import { Timestamp } from '@angular/fire/firestore';

export interface Hashtag {
  __id: string;
  name: string;
  color: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
