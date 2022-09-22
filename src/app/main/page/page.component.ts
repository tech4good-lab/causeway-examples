import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { PageAnimations } from './page.animations';
import { FirebaseService } from '../../core/firebase/firebase.service';
import { withLatestFrom, take, takeUntil, map, subscribeOn } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { User } from '../../core/store/user/user.model';
import { PageSelectors } from './+state/page.selectors';
import { LoadData, Cleanup } from './+state/page.actions';
import { RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';
import { LongTermData } from './+state/page.model';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
})
export class PageComponent implements OnInit {

  // --------------- ROUTE PARAMS & CURRENT USER ---------

  /** The currently signed in user. */
  currentUser$: Observable<User> = this.store.pipe(
    select(fromAuth.selectUser),
  );

  // --------------- LOCAL UI STATE ----------------------

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  /** Get the long term goals data. */
  longTermData$: Observable<LongTermData[]> = this.selectors.selectLongTermData(
    this.currentUser$,
    this.containerId,
  );

  // --------------- DATA BINDING STREAMS ----------------

  // --------------- EVENT BINDING STREAMS ---------------

  // --------------- OTHER -------------------------------

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private selectors: PageSelectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService
  ) {
    // --------------- EVENT HANDLING ----------------------
  }

  ngOnInit() { 
    // --------------- LOAD DATA ---------------------------
    // Once everything is set up, load the data for the role.
    combineLatest(this.longTermData$, this.currentUser$).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([longTermData, currentUser]) => {
      this.store.dispatch(
        new LoadData({
          //longTermData,
          currentUser,
          containerId: this.containerId,
        })
      );
    });

    //this.longTermData$.subscribe(console.log);
  }

  ngOnDestroy() {
    // Unsubscribe subscriptions.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Unsubscribe from firebase connection from load and free up memoized selector values.
    this.store.dispatch(
      new Cleanup({
        containerId: this.containerId,
      })
    );
    this.selectors.cleanup(this.containerId);
  }
}
