import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockDBService {

  // For setting up our mock DB data to contain entries for the current quarter and week
  // In an actual app, there would be a cloud function through which these are generated
  quarterStartTime: number;
  quarterEndTime: number;
  weekStartTime: number;
  weekEndTime: number;

  currentUser(): { [id: string]: any } {
    return {
      uid: 'test-user',
      email: 'test@sample.com',
      name: 'Test User',
      photoURL: 'http://placekitten.com/100/100',
    };
  }

  // The data that is available when a user is signed in (and attached to that
  // particular user)
  currentUserHardcodedData(currentUserId): { [id: string]: any[] } {
    const data = {
      users: [
        {
          __id: 'test-user',
          email: 'test@sample.com',
          name: 'Test User',
          photoURL: 'http://placekitten.com/100/100',
          onboardingState: 1,
        },
      ],
      // add other entities here
    };

    return data;
  }

  // The data that is always available
  generalHardcodedData(): { [id: string]: any[] } {
    return {
      // EXAMPLE
      users: [
        {
          __id: '1',
          email: 'a@sample.com',
          name: 'User A',
          photoURL: 'http://placekitten.com/100/100',
          onboardingState: 1,
        },
        {
          __id: '2',
          email: 'b@sample.com',
          name: 'User Bob',
          photoURL: 'http://placekitten.com/100/100',
          onboardingState: 1,
        },
        {
          __id: '3',
          email: 'c@sample.com',
          name: 'User C',
          photoURL: 'http://placekitten.com/100/100',
          onboardingState: 1,
        },
      ],
      quarters: [
        {
          __id: `${this.quarterStartTime}`,
          startTime: this.quarterStartTime,
          endTime: this.quarterEndTime,
        },
      ],
      quarterGoals: [
        {
          __id: 'qg1',
          __quarterId: `${this.quarterStartTime}`,
          __userId: 'test-user',
          text: 'Finish cover letters',
          completed: false,
          order: 1,
        },
        {
          __id: 'qg2',
          __quarterId: `${this.quarterStartTime}`,
          __userId: 'test-user',
          text: 'Apply to internships',
          completed: false,
          order: 2,
        },
        {
          __id: 'qg3',
          __quarterId: `${this.quarterStartTime}`,
          __userId: 'test-user',
          text: 'Technical interview prep!',
          completed: false,
          order: 3,
        },
      ],
      weeks: [
        {
          __id: `${this.weekStartTime}`,
          startTime: this.weekStartTime,
          endTime: this.weekEndTime,
        },
      ],
      weekGoals: [
        {
          __id: 'wg1',
          __weekId: `${this.weekStartTime}`,
          __userId: 'test-user',
          text: 'Finish Google cover letter',
          hashtag: '#coverletter',
          completed: false,
          order: 1,
        },
        {
          __id: 'wg2',
          __weekId: `${this.weekStartTime}`,
          __userId: 'test-user',
          text: 'Apply to Microsoft',
          hashtag: '#apply',
          completed: false,
          order: 2,
        },
        {
          __id: 'wg3',
          __weekId: `${this.weekStartTime}`,
          __userId: 'test-user',
          text: 'Review data structures',
          hashtag: '#interview',
          completed: false,
          order: 3,
        },
      ],
      longTermGoals: [
        {
          __id: 'ltg',
          __userId: 'test-user',
          oneYear: 'Secure SWE or UX Engineering Internship',
          fiveYear: 'SWE with UX/Design/Animation oriented work',
        }
      ],
      calendarEvents: [
        {
          __id: 'ce1',
          __userId: 'test-user',
          __weekGoalId: `${this.weekStartTime}`,
          startTime: `${this.weekStartTime + 38*60*60*1000}`, // Mon 2pm
          endTime: `${this.weekStartTime + 40*60*60*1000}`, // Mon 4pm
          summary: 'Review arrays and linked lists',
        },
        {
          __id: 'ce2',
          __userId: 'test-user',
          __weekGoalId: `${this.weekStartTime}`,
          startTime: `${this.weekStartTime + 67*60*60*1000}`, // Tue 7pm
          endTime: `${this.weekStartTime + 69*60*60*1000}`, // Tue 9pm
          summary: 'Google cover letter',
        },
        {
          __id: 'ce3',
          __userId: 'test-user',
          __weekGoalId: `${this.weekStartTime}`,
          startTime: `${this.weekStartTime + 86*60*60*1000}`, // Wed 2pm
          endTime: `${this.weekStartTime + 88*60*60*1000}`, // Wed 4pm
          summary: 'Review trees and graphs',
        },
        {
          __id: 'ce4',
          __userId: 'test-user',
          __weekGoalId: `${this.weekStartTime}`,
          startTime: `${this.weekStartTime + 115*60*60*1000}`, // Thu 7pm
          endTime: `${this.weekStartTime + 117*60*60*1000}`, // Thu 9pm
          summary: 'Submit microsoft app',
        },
        {
          __id: 'ce5',
          __userId: 'test-user',
          __weekGoalId: `${this.weekStartTime}`,
          startTime: `${this.weekStartTime + 134*60*60*1000}`, // Fri 2pm
          endTime: `${this.weekStartTime + 136*60*60*1000}`, // Fri 4pm
          summary: 'Review queues and stacks',
        },
      ],
    };
  }

  // helper function
  dateToQuarterStartTime(dateTime: number): number {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    let startingMonthOfQuarter = Math.floor(month / 3) * 3;
    const startingDateOfQuarter = new Date(year, startingMonthOfQuarter, 1);

    return startingDateOfQuarter.getTime();
  }

  dateToQuarterEndTime(dateTime: number): number {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    let startingMonthOfNextQuarter = (Math.floor(month / 3) + 1) * 3;
    const startingDateOfNextQuarter = new Date(
      year,
      startingMonthOfNextQuarter,
      1
    );

    return startingDateOfNextQuarter.getTime() - 1;
  }

  dateToWeekStartTime(dateTime: number): number {
    const date = new Date(dateTime);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(date.getDate() - date.getDay());

    return date.getTime();
  }

  dateToWeekEndTime(dateTime: number): number {

    return this.dateToWeekStartTime(dateTime) + 7*24*60*60*1000 - 1;
  }

  constructor() {
    let now = Date.now();
    this.quarterStartTime = this.dateToQuarterStartTime(now);
    this.quarterEndTime = this.dateToQuarterEndTime(now);
    this.weekStartTime = this.dateToWeekStartTime(now);
    this.weekEndTime = this.dateToWeekEndTime(now);
  }

  getInitialDBStateChanges(collection) {
    const data = this.generalHardcodedData();
    if (data[collection]) {
      const initData = data[collection].map((entity) => {
        return {
          type: 'added',
          result: entity,
        };
      });
      return initData;
    } else {
      return [];
    }
  }

  getCurrentUserDBStateChanges(collection, currentUserId) {
    const data = this.currentUserHardcodedData(currentUserId);
    if (data[collection]) {
      return data[collection].map((entity) => {
        return {
          type: 'added',
          result: entity,
        };
      });
    } else {
      return [];
    }
  }
}
