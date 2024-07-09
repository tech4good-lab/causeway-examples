# Weekly Goal Item Guide - Set up

## Code

### Mandatory to this section
- weekly-goal-item.component.ts
```
import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';


@Component({
  selector: 'app-weekly-goal-item',
  templateUrl: './weekly-goal-item.component.html',
  styleUrls: ['./weekly-goal-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalItemAnimations],
  imports: [],
  standalone: true,
})
export class WeeklyGoalItemComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------
  goal = input.required<WeeklyGoalData>();
  checked = output<WeeklyGoal>();

  // --------------- LOCAL AND GLOBAL STATE --------------


  // --------------- DATA BINDING ------------------------


  // --------------- EVENT BINDING -----------------------


  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor(
  ) { }

  ngOnInit(): void {
  }
}
```
- weekly-goal.component.ts
```
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { HashtagStore, LoadHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { LoadQuarterlyGoal, QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { User } from 'src/app/core/store/user/user.model';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
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

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }
}
```

### Work for the app-weekly-goal-item & home
- home.component.ts
```
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, Signal, inject } from '@angular/core';
import { HomeAnimations } from './home.animations';
import { WeeklyGoalsComponent } from './weekly-goals/weekly-goals.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: HomeAnimations,
  standalone: true,
  imports: [
    WeeklyGoalsComponent,
  ],
})
export class HomeComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------


  // --------------- OTHER -------------------------------

  constructor(
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------

  ngOnInit() {
  }
}

```
- weekly-goal.component.ts
```
import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { HashtagStore, LoadHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { LoadQuarterlyGoal, QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { User } from 'src/app/core/store/user/user.model';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoalItemComponent } from './weekly-goal-item/weekly-goal-item.component';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalsAnimations],
  standalone: true,
  imports: [
    /** component */
    WeeklyGoalItemComponent,
  ],
})
export class WeeklyGoalsComponent implements OnInit, AfterViewInit {
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------


  // --------------- EVENT HANDLING ----------------------
  

  // --------------- OTHER -------------------------------

  constructor(
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
}

```