import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../core/store/app.reducer';
import * as fromAuth from '../../core/store/auth/auth.reducer';
import { PageAnimations } from './page.animations';
import { FirebaseService } from '../../core/firebase/firebase.service';
import { tap, filter, withLatestFrom, take, takeUntil, map, subscribeOn } from 'rxjs/operators';
import { of, distinctUntilChanged, interval, Observable, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { User } from '../../core/store/user/user.model';
import { PageSelectors } from './+state/page.selectors';
import { QuarterData, QuarterGoalInForm } from './+state/page.model';
import { LoadData, Cleanup } from './+state/page.actions';
import { ActionFlow, RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';
import { QuarterGoalActionTypes, UpdateQuarterGoal } from '../../core/store/quarter-goal/quarter-goal.actions';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { ShowSnackbar } from '../../core/snackbar/snackbar.actions';

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
    filter((user) => user !== null),
  );
  
  // --------------- LOCAL AND GLOBAL STATE --------------

  /** For storing the dialogRef in the opened modal. */
  dialogRef: MatDialogRef<any>;

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  // --------------- DATA BINDING ------------------------
  
  /** Raw time in milliseconds from 1970/01/01 00:00:00:000 **/
  currentDateTime$: Observable<number> = interval(1000).pipe(
    map(() => Date.now()),
  );

  /** Current quarter needed to select the right quarter from DB. */
  currentQuarterStartTime$: Observable<number> = this.currentDateTime$.pipe(
    map((now) => this.dateToQuarterStartTime(now)),
    distinctUntilChanged(),
  );

  /** Get the quarter data. */
  quarterData$: Observable<QuarterData> = this.selectors.selectQuarterData(
    this.currentQuarterStartTime$,
    this.currentUser$,
    this.containerId,
  );

  // --------------- EVENT BINDING -----------------------

  /** Event for opening the edit modal. */
  openEditModal$: Subject<void> = new Subject();

  /** Event for saving goal edits. */
  saveGoals$: Subject<{ goals: [QuarterGoalInForm, QuarterGoalInForm, QuarterGoalInForm], loading$: BehaviorSubject<boolean> }> = new Subject();

  // --------------- HELPER FUNCTIONS AND OTHER ----------

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
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() { 
    // --------------- EVENT HANDLING ----------------------

    /** Handle openEditModal events. */
    this.openEditModal$.pipe(
      withLatestFrom(this.quarterData$),
      takeUntil(this.unsubscribe$),
    ).subscribe(([_, quarterData]) => {
      this.dialogRef = this.dialog.open(ModalComponent, {
        height: '366px',
        width: '100%',
        maxWidth: '500px',
        data: {
          quarterData: quarterData,
          updateGoals: (goals: [QuarterGoalInForm, QuarterGoalInForm, QuarterGoalInForm], loading$: BehaviorSubject<boolean>) => {
            this.saveGoals$.next({ goals, loading$ });
          },
        },
        panelClass: 'dialog-container',
      });
    });

    /** Handle save goals events. */
    this.saveGoals$.pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(({ goals, loading$ }) => {

      // Define the action sets we'd like to dispatch
      const actionSets = goals.map((g, i) => {
        return {
          action: new UpdateQuarterGoal(g.__id, { 
            text: g.text,
            order: i + 1,
          }, this.containerId),
          responseActionTypes: {
            success: QuarterGoalActionTypes.UPDATE_SUCCESS,
            failure: QuarterGoalActionTypes.UPDATE_FAIL,
          },
        };
      });
      
      // Dispatch an Action Flow with those actionSets
      // as well as the loading$, successActionFn, and failActionFn
      this.store.dispatch(
        new ActionFlow({
          actionSets,
          loading$,
          successActionFn: (actionSetResponses) => {
            this.dialogRef.close();
            return [
              new ShowSnackbar({
                message: 'Updated quarter goals',
                config: { duration: 3000 },
              })
            ];
          },
          failActionFn: (actionSetResponses) => {
            this.dialogRef.close();
            return [
              new ShowSnackbar({
                message: 'Failed to update quarter goals',
                config: { duration: 3000 },
              }),
            ];
          },
        })
      );
    });

    // --------------- LOAD DATA ---------------------------
    // Once everything is set up, load the data for the role.
    combineLatest(this.currentQuarterStartTime$, this.currentUser$).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([quarterStartTime, currentUser]) => {
      this.store.dispatch(
        new LoadData({
          quarterStartTime,
          currentUser,
        }, this.containerId)
      );
    });

  }

  ngOnDestroy() {
    // Unsubscribe subscriptions.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    // Unsubscribe from firebase connection from load and free up memoized selector values.
    this.store.dispatch(new Cleanup(this.containerId));
    this.selectors.cleanup(this.containerId);
  }
}
