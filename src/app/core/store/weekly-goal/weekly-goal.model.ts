import { Timestamp } from '@angular/fire/firestore';


export interface WeeklyGoal {
  __id: string;
  __userId: string;
  __hashtagId?: string;
  __quarterlyGoalId?: string;
  text: string;
  completed: boolean;
  order: number;
  endDate?: Timestamp;
  _createdAt?: Date;
  _updatedAt?: Date;
  _deleted?: boolean;
}
