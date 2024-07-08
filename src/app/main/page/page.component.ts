import { ChangeDetectionStrategy, Component, OnInit, input, signal, computed, inject, WritableSignal, Signal, effect } from '@angular/core';
import { PageAnimations } from './page.animations';
import { QuarterlyGoalStore } from '../../core/store/quarterly-goal/quarterly-goal.store';
import { HashtagStore } from '../../core/store/hashtag/hashtag.store';
import { UserStore } from '../../core/store/user/user.store';
import { ReflectionStore } from '../../core/store/reflection/reflection.store';
import { WeeklyGoalStore } from '../../core/store/weekly-goal/weekly-goal.store';
import { LongTermGoalStore } from '../../core/store/long-term-goal/long-term-goal.store';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
})
export class PageComponent implements OnInit {
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly longTermGoalStore = inject(LongTermGoalStore);
  readonly reflectionStore = inject(ReflectionStore);
  readonly userStore = inject(UserStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- HELPERS AND SETUP --------------------------

  constructor(
  ) {
    effect(() => {
      console.log('Quarterly Goal', this.quarterlyGoalStore.entities());
    });
    effect(() => {
      console.log('Hashtag', this.hashtagStore.entities());
    });
    effect(() => {
      console.log('LongTermGoal', this.longTermGoalStore.entities());
    });
    effect(() => {
      console.log('Reflection', this.reflectionStore.entities());
    });
    effect(() => {
      console.log('User', this.userStore.entities());
    });
    effect(() => {
      console.log('WeeklyGoal', this.weeklyGoalStore.entities());
    });

  }

  ngOnInit(): void { 
    this.quarterlyGoalStore.load([], {});
    this.longTermGoalStore.load([], {});
  }
}
