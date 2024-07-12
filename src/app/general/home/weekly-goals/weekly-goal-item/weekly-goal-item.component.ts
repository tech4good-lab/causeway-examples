import { ChangeDetectionStrategy, Component, OnInit, Signal, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Timestamp } from '@angular/fire/firestore';
import { MatCheckbox } from '@angular/material/checkbox';
import { of } from 'rxjs';
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

  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  sampleData: WeeklyGoalData = {  
    __id: 'wg1',
    __userId: 'test-user',
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
  };
  goal: Signal<WeeklyGoalData> = toSignal(of(this.sampleData))
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
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
}