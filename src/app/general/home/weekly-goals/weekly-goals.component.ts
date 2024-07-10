import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WeeklyGoalItemComponent } from './weekly-goal-item/weekly-goal-item.component';
import { WeeklyGoalsModalComponent } from './weekly-goals-modal/weekly-goals-modal.component';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { MatButton } from '@angular/material/button';
import { NgOptimizedImage, NgStyle } from '@angular/common';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalsAnimations],
  standalone: true,
  imports: [
    MatButton,
    NgStyle,
    NgOptimizedImage,
    /** component */
    WeeklyGoalItemComponent,
    WeeklyGoalsModalComponent,
  ],
})
export class WeeklyGoalsComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

    /** Update weekly goal. */
    async checkGoal(goal: WeeklyGoal) {
      this.snackBar.open(
        `Clicked on goal "${goal.text}"`,
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