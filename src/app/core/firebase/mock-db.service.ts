import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockDBService {
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
        },
        {
          __id: '2',
          email: 'b@sample.com',
          name: 'User Bob',
          photoURL: 'http://placekitten.com/100/100',
        },
        {
          __id: '3',
          email: 'c@sample.com',
          name: 'User C',
          photoURL: 'http://placekitten.com/100/100',
        },
      ],
      
      quarters: [
        {
          __id: '1656658800000',
          startTime: 1656658800000,
          endTime: 1664607599999,
        },
      ],
      quarterGoals: [
        {
          __id: 'qg1',
          __quarterId: '1656658800000',
          __userId: 'test-user',
          text: 'Finish cover letters',
          completed: false,
          order: 1,
        },
        {
          __id: 'qg2',
          __quarterId: '1656658800000',
          __userId: 'test-user',
          text: 'Apply to internships',
          completed: false,
          order: 2,
        },
        {
          __id: 'qg3',
          __quarterId: '1656658800000',
          __userId: 'test-user',
          text: 'Technical interview prep!',
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
      ]
    };
  }

  constructor() {}

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
