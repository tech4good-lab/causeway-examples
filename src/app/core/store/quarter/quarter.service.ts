import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CachedSelectorsService } from '../cached-selectors.service';
import { FirebaseService } from '../../firebase/firebase.service';
import { Quarter } from './quarter.model';

@Injectable({
  providedIn: 'root',
})
export class QuarterService {
  constructor(
    private cs: CachedSelectorsService,
    private db: FirebaseService,
  ) { }

  /** Select a quarter from the store. */
  public selectQuarter = <T extends Quarter>(
    id: string,
    correlationId: string,
    childrenFn?: (e: Quarter) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.cs.selectEntityObj<Quarter, T>('quarter', id, correlationId, childrenFn);
  };

  /** Select quarters from the store. */
  public selectQuarters = <T extends Quarter>(
    queryParams: [string, string, any][],
    correlationId: string,
    childrenFn?: (e: Quarter) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.cs.selectEntityList<Quarter, T>('quarter', queryParams, correlationId, childrenFn);
  };

  /** Get a quarter directly from the database. */
  public getQuarter = <T extends Quarter>(
    id: string,
    childrenFn?: (e: Quarter) => { [index: string]: Observable<any> },
  ): Observable<T> => {
    return this.db.queryObjOnce<Quarter, T>('quarters', id, childrenFn);
  };

  /** Get quarters directly from the database. */
  public getQuarters = <T extends Quarter>(
    queryParams: [string, string, any][],
    queryOptions?: { [index: string]: any },
    childrenFn?: (e: Quarter) => { [index: string]: Observable<any> },
  ): Observable<Array<T>> => {
    return this.db.queryListOnce<Quarter, T>('quarters', queryParams, queryOptions, childrenFn);
  };
}
