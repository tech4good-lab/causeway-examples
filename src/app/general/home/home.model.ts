import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';
import { WeeklyGoal } from '../../core/store/weekly-goal/weekly-goal.model';

export interface WeeklyGoalData extends WeeklyGoal {
  hashtag: Hashtag;
}

export interface QuarterlyGoalData extends QuarterlyGoal {
  hashtag: Hashtag;
  weeklyGoalsTotal: number;
  weeklyGoalsComplete: number;
}
