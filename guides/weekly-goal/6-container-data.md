# Weekly Goal Item Guide - Container Data

## Code

### Mandatory to this section
- weekly-goal-item.component.html
```
<li class="weekly-goal">
  <mat-checkbox class="check-box" (click)="checkGoal(goal())"></mat-checkbox>
  <div class="goal-details">
    <div class="goal-title">{{ goal().text }}</div>
    <div class="bottom-row">
      <div class="goal-hashtag">#{{ goal().hashtag.name }}</div>
    </div>
  </div>
</li>
```
- weekly-goal-item.component.ts 
```
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoalData } from '../../home.model';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';
import { Timestamp } from '@angular/fire/firestore';
import { USER_DB } from 'src/app/core/firebase/mock-data/user.data';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-weekly-goal-item',
  templateUrl: './weekly-goal-item.component.html',
  styleUrls: ['./weekly-goal-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalItemAnimations],
  imports: [
    MatCheckbox,
  ],
  standalone: true,
})
export class WeeklyGoalItemComponent implements OnInit {
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------
  goal = input.required<WeeklyGoalData>();
  checked = output<WeeklyGoal>();
  checked = output<WeeklyGoal>();

  // --------------- LOCAL AND GLOBAL STATE --------------


  // --------------- DATA BINDING ------------------------


  // --------------- EVENT BINDING -----------------------

  /** Update weekly goal. */
  checkGoal(goal: WeeklyGoal) {
    this.checked.emit(goal);
  }
  

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
```

### Work for weekly-goals and home
- weekly-goal.component.ts
```
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService } from 'src/app/core/store/batch-write.service';
import { HashtagStore, LoadHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { LoadQuarterlyGoal, QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { User } from 'src/app/core/store/user/user.model';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { endOfWeek, getStartWeekDate, startOfWeek } from 'src/app/core/utils/time.utils';
import { QuarterlyGoalData, WeeklyGoalData } from '../home.model';
import { WeeklyGoalItemComponent } from './weekly-goal-item/weekly-goal-item.component';
import { WeeklyGoalsModalComponent } from './weekly-goals-modal/weekly-goals-modal.component';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { USER_DB } from 'src/app/core/firebase/mock-data/user.data';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalsAnimations],
  standalone: true,
  imports: [
    NgOptimizedImage,
    MatCheckbox,
    NgStyle,
    MatButton,
    /** component */
    WeeklyGoalItemComponent,
  ],
})
export class WeeklyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  allWeeklyGoals: Signal<WeeklyGoalData[]> = toSignal(of([
    {  
      __id: 'wg1',
      __userId: USER_DB[0].__id,
      __quarterlyGoalId: 'qg1',
      __hashtagId: 'ht1',
      text: 'Finish Google cover letter',
      completed: false,
      order: 1,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht1',
        name: 'coverletter',
        color: '#EE8B72',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      }
    },
    {
      __id: 'wg2',
      __userId: USER_DB[0].__id,
      __quarterlyGoalId: 'qg2',
      __hashtagId: 'ht2',
      text: 'Apply to Microsoft',
      completed: false,
      order: 2,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht2',
        name: 'apply',
        color: '#2DBDB1',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      }
    },
    {
      __id: 'wg3',
      __userId: USER_DB[0].__id,
      __quarterlyGoalId: 'qg3',
      __hashtagId: 'ht3',
      text: 'Review data structures',
      completed: false,
      order: 3,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht3',
        name: 'interview',
        color: '#FFB987',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      }
    }

  ]));

  // --------------- LOCAL UI STATE ----------------------

  animationDisabled = true;

  // --------------- COMPUTED DATA -----------------------

  endOfWeek = endOfWeek; // import from time.utils.ts

  startOfWeek = startOfWeek; // import from time.utils.ts

  // --------------- EVENT HANDLING ----------------------

  /** Update weekly goal. */
  async checkGoal(goal: WeeklyGoal) {
    this.snackBar.open(
      goal.completed ? 'Marked goal as incomplete' : 'Marked goal as complete',
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
  );
  }


  // --------------- OTHER -------------------------------



  constructor(
    private snackBar: MatSnackBar,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
}

```

- weekly-goals.component.html
```
<article class="weekly-goals-container">
  <header class="weekly-goals-card">
    <div class="desktop-goal-titles">
      <div class="goal-titles">
        <div class="weekly-goals">Weekly Goals</div>
        <button class="edit-weekly-goals" aria-label="Edit goals">
          <img class="edit-icon" ngSrc="../../../../assets/images/edit.svg" alt="Edit" height="16" width="16"/>
        </button>
      </div>
      <div class="goal-time">{{ startOfWeek() + ' - ' + endOfWeek() }}</div>
    </div>
    <div class="responsive-goal-titles">
      <time class="goal-time">{{ startOfWeek() + ' - ' + endOfWeek() }}</time>
      <button class="edit-weekly-goals" aria-label="Edit goals">
        <img class="edit-icon" ngSrc="../../../../assets/images/edit.svg" alt="Edit" height="16" width="16"/>
      </button>
    </div>
  </header>
  <section class="goal-list">
      <ul class="goal-content">
        @for (goal of allWeeklyGoals(); track goal.__id) {
            <app-weekly-goal-item
            [goal]="goal"
            (checked)="checkGoal($event)"/>
        }
      </ul>
    <div class="add-goal-button">
      <button mat-button aria-label="Add goal">
        <div class="add-goal">+ Add a quarter goal</div>
      </button>
    </div>
  </section>
</article>
```
## Text, formatted according to [the style guide](https://docs.google.com/document/d/1KrUSlkgmklM7aqRV1VmsgT0ExjKpIeLW3cDXTEVrzEM/edit?usp=sharing)
