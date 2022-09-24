import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

export interface LongTermData extends LongTermGoal {
  longTermGoals: LongTermGoal[]
}

export interface LongTermGoalsInForm {
    __id: string;
    text: string;
  }