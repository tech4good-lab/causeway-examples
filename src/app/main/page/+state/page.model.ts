import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

export interface LongTermData extends LongTermGoal {
  longTermGoals: LongTermGoal[]
}

export interface LongTermGoalInForm {
    __id: string;
    text: string;
    //oneYear: string;
    //fiveYear: string;
  }