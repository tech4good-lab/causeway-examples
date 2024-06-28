import { Timestamp } from '@angular/fire/firestore';

/** user data */
export interface User {
  __id: string;
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
  name: string;
  email: string;
  photoURL?: string;
  tokens?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
  };
  isAdmin: boolean;
  accessState: AccessState;
  consented: boolean;
  joinedWaitlistAt?: Timestamp;
}

export enum AccessState {
  CONSENT = '01 - consent', // on consent form
  SUBMIT_INTEREST = '02 - submit interest', // short form on login with basic interest
  SUBMIT_DETAILED = '03 - submit detailed', // longer form on richer context
  WAITING = '04 - waiting', // on waitlist for early access
  // PLACEHOLDER: uncomment below for app-specific walkthrough page
  // WALKTHROUGH = '05 - walkthrough', // on app specific walkthrough page
  DONE = 'done', // finished with the entire flow
}
