# Weekly Goal Item Guide - Responsive Layout

## Code

### Mandatory to this section

- *nothing related to weekly-goal-item*

### Work for weekly-goals and home
- weekly-goal.component.html
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
            <app-weekly-goal-item
              (checked)="checkGoal($event)"/>
              <app-weekly-goal-item
              (checked)="checkGoal($event)"/>
              <app-weekly-goal-item
              (checked)="checkGoal($event)"/>
      </ul>
    <div class="add-goal-button">
      <button mat-button aria-label="Add goal">
        <div class="add-goal">+ Add a quarter goal</div>
      </button>
    </div>
  </section>
</article>
```

- weekly-goals.component.ts
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


  // --------------- LOCAL UI STATE ----------------------

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
- home.component.html
```
<div class="dashboard-container">
  <div class="goals">
    <!-- Large screen view -->
    @if (!isSmallScreen()) {
      <ng-container>
      <article class="card-backgrounds-parent">
        <app-weekly-goals></app-weekly-goals>
      </article>
    </ng-container>
  } @else {
      <ng-container class="phone-template">
      <mat-tab-group>
        <mat-tab label="Weekly">
          <ng-template matTabContent>
            <app-weekly-goals></app-weekly-goals>
          </ng-template>
        </mat-tab>
        <mat-tab label="Quarterly">
          <ng-template matTabContent>
            <div>Quarterly goals</div>
          </ng-template>
        </mat-tab>
        <mat-tab label="Long Term">
          <div>Long term goals</div>
        </mat-tab>
      </mat-tab-group>
      </ng-container>
  }
  </div>
</div>
```

- home.component.ts
```
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { AuthStore } from '../../core/store/auth/auth.store';
import { HashtagStore } from '../../core/store/hashtag/hashtag.store';
import { WeeklyGoalStore } from '../../core/store/weekly-goal/weekly-goal.store';
import { HomeAnimations } from './home.animations';
import { MatTabGroup, MatTab, MatTabContent } from '@angular/material/tabs';
import { LongTermGoalsComponent } from './long-term-goals/long-term-goals.component';
import { QuarterlyGoalsComponent } from './quarterly-goals/quarterly-goals.component';
import { WeeklyGoalsComponent } from './weekly-goals/weekly-goals.component';
import { TimeHeaderComponent } from './time-header/time-header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: HomeAnimations,
  standalone: true,
  imports: [
    TimeHeaderComponent,
    WeeklyGoalsComponent,
    QuarterlyGoalsComponent,
    LongTermGoalsComponent,
    MatTabGroup,
    MatTab,
    MatTabContent,
  ],
})
export class HomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);


  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  /** Signal for detecting screen size */
  isSmallScreen: Signal<boolean> = toSignal(
    this.breakpointObserver.observe('(max-width: 850px)')
        .pipe(map((state) => {
          return state.matches;
        })),
  );

  // --------------- EVENT HANDLING ----------------------


  // --------------- OTHER -------------------------------

  constructor(
    private breakpointObserver: BreakpointObserver,
    private destroyRef: DestroyRef,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
  }
}
```
## Text, formatted according to [the style guide](https://docs.google.com/document/d/1KrUSlkgmklM7aqRV1VmsgT0ExjKpIeLW3cDXTEVrzEM/edit?usp=sharing)
