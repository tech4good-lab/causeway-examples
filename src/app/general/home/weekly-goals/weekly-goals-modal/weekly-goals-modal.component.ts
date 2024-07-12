import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { QuarterlyGoalData, WeeklyGoalData } from '../../home.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
import { MatOption } from '@angular/material/core';
import { NgFor } from '@angular/common';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { MatSelect } from '@angular/material/select';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatDialogContent,
    MatOption,
    NgFor,
    CdkDragHandle,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatTooltip,
  ],
})
export class WeeklyGoalsModalComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------
  weeklyGoalsForm!: FormGroup;

  // --------------- COMPUTED DATA -----------------------

  startOfWeek = startOfWeek;

  endOfWeek = endOfWeek


  // --------------- EVENT HANDLING ----------------------

  /** Save any updates for any of the goals. */
  async saveGoal() {
    await this.data.updateWeeklyGoal(this.weeklyGoalsForm);
  }
  
  // --------------- OTHER -------------------------------

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      goal: WeeklyGoalData,
      allQuarterlyGoals: Partial<QuarterlyGoalData>[],
      updateWeeklyGoal: ( weeklyGoalForm: FormGroup ) => void,
    },
    public dialogRef: MatDialogRef<WeeklyGoalsModalComponent>,
    private fb: FormBuilder,
  ) { }


  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
      /** FormControls for editing past goals and adding a new one */
      this.weeklyGoalsForm = this.fb.group({
        __weeklyGoalId: this.data.goal.__id,
        text: [this.data.goal.text, Validators.required],
        originalText: this.data.goal.text,
        originalOrder: 1,
        originalQuarterlyGoalId: this.data.goal.__quarterlyGoalId,
        __quarterlyGoalId: [this.data.goal.__quarterlyGoalId, Validators.required], // changed from hashtagId
      });
  }
}
