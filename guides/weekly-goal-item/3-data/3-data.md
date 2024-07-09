# Weekly Goal Item Guide - Data Binding

## Text Overview

Now that we've written the static implementation of our component, let's revisit our component's type script file and rewrite it so it has an input and output like a typical dynamic component would. We'll import ``input`` and ``output`` for this from ``@angular/core``. For our input, we're going to create some hardcoded variable of the custom type ``WeeklyGoalData``, which combines the properties of a standard weekly goal and hashtag. It's practical to use types that extend our pre-defined types you'll see in the ``src/app/core/store`` folder to bundle together associated data (as each weekly goal has its own hashtag). We'll pass in that hard-coded variable as the parameter to ``input()`` for now, but later we'll be getting our goals from our mock database. We can access any of the properties our input in our HTML file with the syntax ``goal()`` (if our input was named ``goal``, which is a signal). This is because ``input()`` converts the data its given to be a Signal. To access a signal's current value, we add a ``()`` at the end.

## Code

### Mandatory to this section
- weekly-goal-item.component.html
```
<li class="weekly-goal">
  <mat-checkbox class="check-box"></mat-checkbox>
  <div class="goal-details">
    <div class="goal-title">{{ goal().text }}</div>
    <div class="bottom-row">
      <div class="goal-hashtag">{{ goal().hashtag.name }}</div>
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
  goal = input<WeeklyGoalData>(this.sampleData);
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