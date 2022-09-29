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
import { ActionFlow, RouterNavigate } from '../../core/store/app.actions';
import { UpdateUser } from '../../core/store/user/user.actions';
import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model';
import { LongTermData, LongTermGoalInForm } from './+state/page.model';
import { LongTermGoalActionTypes, UpdateLongTermGoal } from '../../core/store/long-term-goal/long-term-goal.actions';
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
  );

  // --------------- LOCAL UI STATE ----------------------

  // --------------- DB ENTITY DATA ----------------------

  /** Container id for selectors and loading. */
  containerId: string = this.db.createId();

  /** Get the long term goal data. */
  longTermData$: Observable<LongTermData> = this.selectors.selectLongTermData(
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
    this.openEditModal$.pipe(
      withLatestFrom(this.longTermData$),
      takeUntil(this.unsubscribe$),
    ).subscribe(([_, longTermData]) => {

      const dialogRef = this.dialog.open(ModalComponent, {
        height: '366px',
        width: '100%',
        maxWidth: '500px',
        panelClass: 'dialog-container',
        data: {
          longTermData,
          updateGoals: (
            goals: [LongTermGoalInForm, LongTermGoalInForm],
            loading$: BehaviorSubject<boolean>,
          ) => {
            // const actionSets = goals.map((g, i) => {
            const actionSets = goals.map((g) => {
              return {
                action: new UpdateLongTermGoal(g.__id, { 
                  //oneYear: g.year === 'one' ? g.text : longTermData.oneYear,
                  //fiveYear: g.year === 'five' ? g.text : longTermData.fiveYear,

                  // Does above one work?
                  oneYear: g.text,
                  fiveYear: g.text, 
                }, this.containerId),
                responseActionTypes: {
                  success: LongTermGoalActionTypes.UPDATE_SUCCESS,
                  failure: LongTermGoalActionTypes.UPDATE_FAIL,
                },
              };
            });

            this.store.dispatch(
              new ActionFlow({
                actionSets,
                loading$,
                successActionFn: (actionSetResponses) => {
                  loading$.next(false);
                  dialogRef.close();
                  return [
                    new ShowSnackbar({
                      message: 'Updated long term goals',
                      config: { duration: 3000 },
                    })
                  ];
                },
                failActionFn: (actionSetResponses) => {
                  loading$.next(false);
                  dialogRef.close();
                  return [
                    new ShowSnackbar({
                      message: 'Failed to update long term goals',
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
    combineLatest(this.longTermData$, this.currentUser$).pipe(
      takeUntil(this.unsubscribe$),
    ).subscribe(([longTermData, currentUser]) => {
      this.store.dispatch(
        new LoadData({
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
