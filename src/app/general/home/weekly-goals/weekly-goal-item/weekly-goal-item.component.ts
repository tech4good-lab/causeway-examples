import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, effect, inject, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { USER_1 } from 'src/app/core/firebase/mock-db.service';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { HashtagStore, LoadHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { LoadQuarterlyGoal, QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
import { QuarterlyGoalData, WeeklyGoalData } from '../../home.model';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { WeeklyGoalsModalComponent } from '../weekly-goals-modal/weekly-goals-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Timestamp } from '@angular/fire/firestore';
import { User } from 'src/app/core/store/user/user.model';

@Component({
  selector: 'app-weekly-goal-item',
  templateUrl: './weekly-goal-item.component.html',
  styleUrls: ['./weekly-goal-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalItemAnimations],
  imports: [
    NgOptimizedImage,
    NgStyle,
    MatCheckbox,
  ],
  standalone: true,
})
export class WeeklyGoalItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  /** Data for the first weekly goal + their associated quarterly goals and hashtags. */
  goal: Signal<WeeklyGoalData> = computed(() => {
    const weeklyGoal = this.weeklyGoalStore.selectFirst([
    ['__userId', '==', this.currentUser().__id]], { orderBy: 'order' });
    // get the quarter goal associated with that weekly goal to make updates easier
    const quarterGoal = this.quarterlyGoalStore.selectEntity(weeklyGoal?.__quarterlyGoalId);
    return Object.assign({}, weeklyGoal, {
      hashtag: this.hashtagStore.selectEntity(quarterGoal?.__hashtagId),
      quarterGoal: quarterGoal,
    });

  });
  /** All quarterly goals, needed for weekly goals modal */
  allQuarterlyGoals: Signal<Partial<QuarterlyGoalData>[]> = computed(() => {
    const allGoals = this.quarterlyGoalStore.selectEntities([
      ['__userId', '==', this.currentUser().__id],
    ], { orderBy: 'order' });

    return allGoals.map((goal) => {
      return Object.assign({}, goal, {
        hashtag: this.hashtagStore.selectEntity(goal.__hashtagId),
      });
    });
  });

  // --------------- LOCAL UI STATE ----------------------

  /** For storing the dialogRef in the opened modal. */
  dialogRef: MatDialogRef<any>;

  // --------------- COMPUTED DATA -----------------------

  endOfWeek = endOfWeek; // import from time.utils.ts

  startOfWeek = startOfWeek; // import from time.utils.ts

  // --------------- EVENT HANDLING ----------------------

  /** Update weekly goal. */
  async checkGoal(goal: WeeklyGoal) {
    try {
      await this.weeklyGoalStore.update(goal.__id, {
        completed: !goal.completed,
        ...(!goal.completed ? { endDate: Timestamp.now() } : {}),
      }, {
        optimistic: true,
      });
      this.snackBar.open(
        goal.completed ? 'Marked goal as incomplete' : 'Marked goal as complete',
        '',
        {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        },
      );
    } catch (e) {
      console.error(e);
      this.snackBar.open('Failed to update goal', '', {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      });
    }
  }

  /** Open add or edit goals modal for weekly goals. */
  openModal(goal: WeeklyGoalData) {
    this.dialogRef = this.dialog.open(WeeklyGoalsModalComponent, {
      height: '90%',
      width: '80%',
      position: { bottom: '0' },
      data: {
        goal,
        allQuarterlyGoals: this.allQuarterlyGoals(),
        updateWeeklyGoal: async (weeklyGoalForm) => {
          try {
            if ((weeklyGoalForm.value.originalText !== weeklyGoalForm.value.text) || (weeklyGoalForm.value.originalQuarterlyGoalId !== weeklyGoalForm.value.__quarterlyGoalId)) {
              await this.weeklyGoalStore.update(weeklyGoalForm.value.__weeklyGoalId, Object.assign({}, {
                __quarterlyGoalId: weeklyGoalForm.value.__quarterlyGoalId,
                text: weeklyGoalForm.value.text,
              }));
            }
            this.dialogRef.close();
          } catch (e) {
            console.error(e);
          }
        },
      },
    });
  }

  
  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { 
    // this is here for people to see what's loaded into store!
    effect(() => {
      console.log('Quarterly Goal', this.quarterlyGoalStore.entities());
    });
    effect(() => {
      console.log('Hashtag', this.hashtagStore.entities());
    });
    effect(() => {
      console.log('WeeklyGoal', this.weeklyGoalStore.entities());
    });
  }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
    // loading all weekly goals + their associated quarterly goals and hashtags
    this.weeklyGoalStore.load([['__userId', '==', this.currentUser().__id], ['endDate', '>=', Timestamp.fromDate(getStartWeekDate())]], {}, (wg) => [
      LoadQuarterlyGoal.create(this.quarterlyGoalStore, [['__id', '==', wg.__quarterlyGoalId]], {}, (qg) => [
        LoadHashtag.create(this.hashtagStore, [['__id', '==', qg.__hashtagId]], {}),
      ]),
    ]);
  }
}