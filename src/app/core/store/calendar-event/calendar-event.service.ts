import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { CalendarEvent } from './calendar-event.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarEventService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a calendarEvent from the store. */
  public selectCalendarEvent = <T extends CalendarEvent>(
    id: string,
    correlationId: string,
    childrenFn?: (e: CalendarEvent) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<CalendarEvent, T>('calendarEvent', id, correlationId, childrenFn);
  };

  /** Select calendarEvents from the store. */
  public selectCalendarEvents = <T extends CalendarEvent>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: CalendarEvent) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<CalendarEvent, T>('calendarEvent', queryParams, correlationId, childrenFn);
  };

  /** Get a calendarEvent directly from the database. */
  public getCalendarEvent = <T extends CalendarEvent>(
    id: string,
    childrenFn?: (e: CalendarEvent) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<CalendarEvent, T>('calendarEvents', id, childrenFn);
  };

  /** Get calendarEvents directly from the database. */
  public getCalendarEvents = <T extends CalendarEvent>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: CalendarEvent) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<CalendarEvent, T>('calendarEvents', queryParams, queryOptions, childrenFn);
  };
}
