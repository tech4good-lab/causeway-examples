import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { PageAnimations } from './page.animations';
import { FirebaseService } from '../../core/firebase/firebase.service';
import {
  tap,
  withLatestFrom,
  take,
  takeUntil,
  map,
  subscribeOn,
} from 'rxjs/operators';
import {
  distinctUntilChanged,
  interval,
  Observable,
  Subject,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import { PageSelectors } from './+state/page.selectors';
import { QuarterData, QuarterGoalInForm } from './+state/page.model';
import { LoadData, Cleanup } from './+state/page.actions';
import { ActionFlow, RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';
import {
  QuarterGoalActionTypes,
  UpdateQuarterGoal,
} from '../../core/store/quarter-goal/quarter-goal.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { ShowSnackbar } from '../../core/snackbar/snackbar.actions';
import { User } from 'src/app/core/store/user/user.model';

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
  currentUser$: Observable<User> = this.store.pipe(select(fromAuth.selectUser));

  // --------------- LOCAL UI STATE ----------------------

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  /** Raw time in milliseconds from 1970/01/01 00:00:00:000 **/
  currentDateTime$: Observable<number> = interval(1000).pipe(
    map(() => Date.now())
  );

  /** Current quarter. */
  currentQuarterStartTime$: Observable<number> = this.currentDateTime$.pipe(
    map((now) => this.dateToQuarterStartTime(now)),
    distinctUntilChanged()
  );

  /** Get the quarter data. */
  quarterData$: Observable<QuarterData> = this.selectors.selectQuarterData(
    this.currentQuarterStartTime$,
    this.currentUser$,
    this.containerId
  );

  // --------------- DATA BINDING STREAMS ----------------

  // --------------- EVENT BINDING STREAMS ---------------

  /** Event for opening the edit modal. */
  openEditModal$: Subject<void> = new Subject();

  // --------------- OTHER -------------------------------

  /** Helper function for converting timestamp to quarter start time. */
  dateToQuarterStartTime(dateTime: number): number {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = date.getMonth();
    let startingMonthOfQuarter = Math.floor(month / 3) * 3;
    const startingDateOfQuarter = new Date(year, startingMonthOfQuarter, 1);

    return startingDateOfQuarter.getTime();
  }

  /** Unsubscribe observable for subscriptions. */
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private selectors: PageSelectors,
    private store: Store<fromStore.State>,
    private db: FirebaseService,
    private dialog: MatDialog
  ) {
    // --------------- EVENT HANDLING ----------------------

    /** Handle openEditModal events. */
    this.openEditModal$
      .pipe(withLatestFrom(this.quarterData$), takeUntil(this.unsubscribe$))
      .subscribe(([_, quarterData]) => {
        const dialogRef = this.dialog.open(ModalComponent, {
          height: '366px',
          width: '100%',
          maxWidth: '500px',
          panelClass: 'dialog-container',
          data: {
            quarterData,
            updateGoals: (
              goals: [QuarterGoalInForm, QuarterGoalInForm, QuarterGoalInForm],
              loading$: BehaviorSubject<boolean>
            ) => {
              // Preparing the actions and setup for the ActionFlow
              const actionSets = goals.map((g, i) => {
                return {
                  action: new UpdateQuarterGoal(
                    g.__id,
                    {
                      text: g.text,
                      order: i + 1,
                    },
                    this.containerId
                  ),
                  responseActionTypes: {
                    success: QuarterGoalActionTypes.UPDATE_SUCCESS,
                    failure: QuarterGoalActionTypes.UPDATE_FAIL,
                  },
                };
              });

              // Dispatching all actions and handling logic after success
              this.store.dispatch(
                new ActionFlow({
                  actionSets,
                  loading$,
                  successActionFn: (actionSetResponses) => {
                    dialogRef.close();
                    return [
                      new ShowSnackbar({
                        message: 'Updated quarter goals',
                        config: { duration: 3000 },
                      }),
                    ];
                  },
                  failActionFn: (actionSetResponses) => {
                    dialogRef.close();
                    return [
                      new ShowSnackbar({
                        message: 'Failed to update quarter goals',
                        config: { duration: 3000 },
                      }),
                    ];
                  },
                })
              );
            },
          },
        });
      });
  }

  ngOnInit() {
    // --------------- LOAD DATA ---------------------------
    // Once everything is set up, load the data for the role.
    combineLatest(this.currentQuarterStartTime$, this.currentUser$)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([quarterStartTime, currentUser]) => {
        this.store.dispatch(
          new LoadData({
            quarterStartTime,
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


