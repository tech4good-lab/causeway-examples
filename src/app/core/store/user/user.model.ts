export interface User {
  __id: string;
  name: string;
  email: string;
  photoURL?: string;
  onboardingState: OnboardingState;
}

export enum OnboardingState {
  WELCOME = 1,
  LONG_TERM_GOALS = 2,
  QUARTER_PROMPT = 3,
  QUARTER_GOALS = 4,
  WEEKLY_PROMPT = 5,
  WEEKLY_GOALS = 6,
  HASHTAG_PROMPT = 7,
  HASHTAGS = 8,
  SCHEDULING_PROMPT = 9,
  SCHEDULING = 10,
  COMPLETE = 11,
}
