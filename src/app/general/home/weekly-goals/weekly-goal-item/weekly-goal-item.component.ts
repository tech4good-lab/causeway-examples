import { ChangeDetectionStrategy, Component, OnInit, Signal, inject, input, output } from '@angular/core';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';
import { MatCheckbox } from '@angular/material/checkbox';
import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalData } from '../../home.model';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { USER_DB } from 'src/app/core/firebase/mock-data/user.data';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
import { WeeklyGoalStore } from 'src/app/core/store/weekly-goal/weekly-goal.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

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