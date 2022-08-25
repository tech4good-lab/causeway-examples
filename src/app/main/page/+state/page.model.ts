import { Quarter } from '../../../core/store/quarter/quarter.model';
import { QuarterGoal } from '../../../core/store/quarter-goal/quarter-goal.model';

export interface QuarterData extends Quarter {
  quarterGoals: QuarterGoal[];
}
