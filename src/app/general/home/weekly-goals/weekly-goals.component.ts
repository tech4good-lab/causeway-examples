import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { WeeklyGoalItemComponent } from './weekly-goal-item/weekly-goal-item.component';
import { WeeklyGoalsModalComponent } from './weekly-goals-modal/weekly-goals-modal.component';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { MatButton, MatIconButton } from '@angular/material/button';
import { NgFor, NgOptimizedImage, NgStyle } from '@angular/common';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkDropList, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialogClose } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from 'src/app/core/core.module';
import { MainModule } from 'src/app/main/main.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalsAnimations],
  standalone: true,
  imports: [
    MatButton,
    /** component */
    WeeklyGoalItemComponent,
    WeeklyGoalsModalComponent,
    MatIconButton,
    MatDialogClose,
  ],
})
export class WeeklyGoalsComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  endOfWeek = endOfWeek; // import from time.utils.ts

  startOfWeek = startOfWeek; // import from time.utils.ts

  // --------------- EVENT HANDLING ----------------------
  
  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
}