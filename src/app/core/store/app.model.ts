// Entity Models
import { User } from './user/user.model';
import { Hashtag } from './hashtag/hashtag.model';
import { LongTermGoal } from './long-term-goal/long-term-goal.model';
import { QuarterlyGoal } from './quarterly-goal/quarterly-goal.model';
import { WeeklyGoal } from './weekly-goal/weekly-goal.model';
import { Reflection } from './reflection/reflection.model';
import { UserContext } from './user-context/user-context.model';

export type AnyEntity =
  User |
  Hashtag |
  LongTermGoal |
  QuarterlyGoal |
  WeeklyGoal |
  Reflection |
  UserContext;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryParams = [string, string, any][];

export type QueryOptions = {
  orderBy?: string | [string, string],
  limit?: number,
  startAt?: string,
  startAfter?: string,
  endAt?: string,
  endBefore?: string,
}
