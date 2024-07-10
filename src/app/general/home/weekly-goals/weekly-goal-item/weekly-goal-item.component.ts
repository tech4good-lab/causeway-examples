import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, effect, inject, output } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { USER_1 } from 'src/app/core/firebase/mock-db.service';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { HashtagStore } from 'src/app/core/store/hashtag/hashtag.store';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
import { WeeklyGoalData } from '../../home.model';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';

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
  readonly authStore = inject(AuthStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Data for the first weekly goal + their associated quarterly goals and hashtags. */
  goal: Signal<WeeklyGoalData> = computed(() => {
    const weeklyGoals = this.weeklyGoalStore.selectEntities([
    ['__userId', '==', USER_1.__id]], { orderBy: 'order' });
    const allWeeklyGoalData = weeklyGoals.map((goal) => {

      // get the quarter goal associated with that weekly goal to make updates easier
      const quarterGoal = this.quarterlyGoalStore.selectEntity(goal.__quarterlyGoalId);
      return Object.assign({}, goal, {
        hashtag: this.hashtagStore.selectEntity(quarterGoal?.__hashtagId),
        quarterGoal: quarterGoal,
      });
    });
    // give back some random weekly goal for database for visual variety
    return allWeeklyGoalData[Math.floor(Math.random() * allWeeklyGoalData.length)];

  });
  checked = output<WeeklyGoal>();

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  endOfWeek = endOfWeek; // import from time.utils.ts

  startOfWeek = startOfWeek; // import from time.utils.ts

  // --------------- EVENT HANDLING ----------------------

  /** Update weekly goal. */
  checkGoal(goal: WeeklyGoal) {
    this.checked.emit(goal);
  }
  
  // --------------- OTHER -------------------------------

  constructor(
    
  ) { 

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
    this.weeklyGoalStore.load([], {});
    this.quarterlyGoalStore.load([], {});
    this.hashtagStore.load([], {});

  }
}