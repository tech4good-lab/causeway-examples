import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
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
    MatDialogClose,
    MatIcon,
    MatDialogContent,
    MatOption,
    NgFor,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
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

  
  // --------------- OTHER -------------------------------

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      goal: WeeklyGoalData,
      allQuarterlyGoals: Partial<QuarterlyGoalData>[],
    },
    public dialogRef: MatDialogRef<WeeklyGoalsModalComponent>,
    private fb: FormBuilder,
  ) { }


  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
