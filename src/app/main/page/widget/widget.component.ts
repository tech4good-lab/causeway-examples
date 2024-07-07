import { effect, Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, inject, signal, WritableSignal, Signal, Injector, computed, output, input, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { createId } from '../../../core/utils/rand.utils';
import { WidgetAnimations } from './widget.animations';

import { LoadQuarterlyGoal, QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { LoadWeeklyGoal, StreamWeeklyGoal, WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';

import { serverTimestamp, Timestamp } from '@angular/fire/firestore';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { LoadHashtag, StreamHashtag, HashtagStore } from 'src/app/core/store/hashtag/hashtag.store';
import { Hashtag } from 'src/app/core/store/hashtag/hashtag.model';
import { User } from 'src/app/core/store/user/user.model';

import { QuarterlyGoalData } from '../page.model';
import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';

import { ModalComponent } from '../modal/modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model';
import { LongTermGoalStore, LoadLongTermGoal, StreamLongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.store';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly longTermGoal = inject(LongTermGoalStore);
  
  // readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  // readonly weeklyGoalStore = inject(WeeklyGoalStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  
  longTermGoals: Signal<LongTermGoal[]> = computed(() => {
    const goals = this.longTermGoal.selectEntities([
      ['__id', '==', 'ltg'],
    ], { orderBy: 'order' });

    console.log('Computed longTermGoals:', goals);

    return goals;
  });

  // longTermGoals: Signal<LongTermGoals[]> = computed(() => {
  //   return longTermStore.selectEntities([ /** any filters you might want to apply /], {/* if you need to order or restrict the number of docs selected*/})
  // });

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  /** For storing the dialogRef in the opened modal. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dialogRef: MatDialogRef<any>;

  // --------------- COMPUTED DATA -----------------------

  /** Helper function for calculating quarter name and year */


  /** Helper function for calculating the start and end of a quarter */
  // TODO: the current quarterEndDate will miss things that are a few hours/minutes/days past
  // the beginning of that date, e.g. March 31st noon will not be counted in Jan-Mar quarter

  // --------------- EVENT HANDLING ----------------------


  /** Open add or edit goals modal. */
  // openModal() {
  //   this.dialogRef = this.dialog.open(ModalComponent, {
  //     width: '65%',
  //     height: '90%',
  //     position: { bottom: '0' },
  //     data: {
  //       incompleteGoals: this.incompleteQuarterlyGoals(),
  //       updateQuarterlyGoals: async (quarterGoalsFormArray) => {
  //         try {
  //           await Promise.all(quarterGoalsFormArray.controls.map(async (control, i) => {
  //             const promises = [];
  //             // if this is a new quarter goal
  //             if (!control.value.__quarterlyGoalId) {
  //               // Add a hashtag
  //               // TODO: need to carefully think through the logic for colors
  //               const hashtagId = createId();
  //               const colors = ['#EE8B72', '#2DBDB1', '#FFB987'];
  //               promises.push(
  //                 this.hashtagStore.add(Object.assign({}, {
  //                   __id: hashtagId,
  //                   name: control.value.hashtagName,
  //                   color: colors[i % colors.length], // changed so that it depends on order
  //                 })),
  //               );

  //               // Add a new quarter goal
  //               promises.push(
  //                 this.quarterlyGoalStore.add(Object.assign({}, {
  //                   __userId: this.currentUser().__id,
  //                   __hashtagId: hashtagId,
  //                   text: control.value.text,
  //                   completed: false,
  //                   order: i + 1,
  //                 })),
  //               );
  //             } else {
  //               const hashtagId = control.value.__hashtagId ? control.value.__hashtagId : createId();
  //               if (control.value.__hashtagId && control.value.hashtagName !== control.value.originalHashtagName) {
  //                 // There was a hashtag, but we've updated it
  //                 // Update a hashtag
  //                 promises.push(
  //                   this.hashtagStore.update(control.value.__hashtagId, {
  //                     name: control.value.hashtagName,
  //                   }),
  //                 );
  //               } else if (!control.value.__hashtagId && control.value.hashtagName) {
  //                 // There was no hashtag, but we've added one
  //                 // Add a hashtag
  //                 const colors = ['#EE8B72', '#2DBDB1', '#FFB987'];
  //                 promises.push(
  //                   this.hashtagStore.add(Object.assign({}, {
  //                     __id: hashtagId,
  //                     name: control.value.hashtagName,
  //                     color: colors[i % colors.length],
  //                   })),
  //                 );
  //               }

  //               // Update a new quarter goal
  //               if (control.value.originalText !== control.value.text || control.value.originalOrder !== i+1 || (!control.value.__hashtagId && control.value.hashtagName)) {
  //                 promises.push(
  //                   this.quarterlyGoalStore.update(control.value.__quarterlyGoalId, {
  //                     __hashtagId: hashtagId,
  //                     text: control.value.text,
  //                     order: i + 1,
  //                   }),
  //                 );
  //               }
  //             }
  //             await Promise.all(promises);
  //           }));
  //           this.dialogRef.close();
  //           this.snackBar.open('Goals successfully updated', 'Close', {
  //             duration: 3000,
  //           });
  //         } catch (e) {
  //           console.error(e);
  //           this.snackBar.open('Goal not added successfully', 'Close', {
  //             duration: 3000,
  //           });
  //         }
  //       },
  //     },
  //   });
  // }



  // --------------- OTHER -------------------------------

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private injector: Injector,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit(): void {
    // Load entities to store
    
    console.log("WOMPWOMP");
    this.longTermGoal.load([['__id', '==', 'ltg']], {});

  }
}
