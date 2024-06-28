import { Timestamp } from '@angular/fire/firestore';

export interface QuarterlyGoal {
  __id: string;
  __userId: string;
  __hashtagId?: string;
  text: string;
  completed: boolean;
  order: number;
  endDate?: Timestamp;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
