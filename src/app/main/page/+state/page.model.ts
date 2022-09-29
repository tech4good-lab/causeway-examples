import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

export interface LongTermData extends LongTermGoal {
  longTermGoals: LongTermGoal[] // Didn't end up using this one
}

export interface LongTermGoalInForm {
  __id: string;
  year: string;
  text: string;
}