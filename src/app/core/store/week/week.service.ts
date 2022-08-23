import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { Week } from './week.model';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a week from the store. */
  public selectWeek = <T extends Week>(
    id: string,
    correlationId: string,
    childrenFn?: (e: Week) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<Week, T>('week', id, correlationId, childrenFn);
  };

  /** Select weeks from the store. */
  public selectWeeks = <T extends Week>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: Week) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<Week, T>('week', queryParams, correlationId, childrenFn);
  };

  /** Get a week directly from the database. */
  public getWeek = <T extends Week>(
    id: string,
    childrenFn?: (e: Week) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<Week, T>('weeks', id, childrenFn);
  };

  /** Get weeks directly from the database. */
  public getWeeks = <T extends Week>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: Week) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<Week, T>('weeks', queryParams, queryOptions, childrenFn);
  };
}
