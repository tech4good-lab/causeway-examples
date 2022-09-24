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
import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model'; // ADDED
import { LongTermData, LongTermGoalInForm } from './+state/page.model'; // ADDED
//import { LongTermGoalService } from '/../../core/store/long-term-goal/long-term-goal.service';  // ADDED
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
})
export class PageComponent implements OnInit {

  // --------------- ROUTE PARAMS & CURRENT USER ---------
  /** The currently signed in user. */  // ADDED
  currentUser$: Observable<User> = this.store.pipe(
    select(fromAuth.selectUser),
  );

  // --------------- LOCAL UI STATE ----------------------

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  /** Get the long term goal data. */  // ADDED
  longTermGoals$: Observable<LongTermGoal[]> = this.selectors.selectLongTermGoals(
    this.currentUser$,
    this.containerId,
  );

  // --------------- DATA BINDING STREAMS ----------------

  // --------------- EVENT BINDING STREAMS ---------------
  /** Event for opening the edit modal. */
  openEditModal$: Subject<void> = new Subject();

  // --------------- OTHER -------------------------------

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private selectors: PageSelectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService,
    private dialog: MatDialog,
  ) {
    // --------------- EVENT HANDLING ----------------------
    /** Handle openEditModal events. */
    this.openEditModal$.pipe(
      //withLatestFrom(this.quarterData$),
      withLatestFrom(this.longTermGoals$),
      takeUntil(this.unsubscribe$),
    ).subscribe(([_, longTermGoals]) => {

      const dialogRef = this.dialog.open(ModalComponent, {
        height: '366px',
        width: '100%',
        maxWidth: '500px',
        data: {
          longTermGoals,
          updateGoals: (
            goals: [LongTermGoalInForm, LongTermGoalInForm, LongTermGoalInForm],
            loading$: BehaviorSubject<boolean>,
          ) => {
            console.log(goals);
          }
        },
      });
    });
  }

  ngOnInit() { 
    // --------------- LOAD DATA ---------------------------
    // Once everything is set up, load the data for the role.
    combineLatest(this.longTermGoals$, this.currentUser$).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([longTermGoals, currentUser]) => {
      this.store.dispatch(
        new LoadData({
          longTermGoals,
          currentUser,
          containerId: this.containerId,
        })
      );
    });
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
