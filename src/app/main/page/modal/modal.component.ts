import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LongTermData, LongTermGoalInForm } from '../+state/page.model';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ---------


  // --------------- LOCAL UI STATE ----------------------

  /** A loading indicator. */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /** Local state for form info. */
  longTermGoalsForm: [LongTermGoalInForm, LongTermGoalInForm];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      longTermData: LongTermData,
      updateGoals: (
        //goals: [LongTermGoalInForm, LongTermGoalInForm,LongTermGoalInForm],
        goals: [LongTermGoalInForm, LongTermGoalInForm],
        loading$: BehaviorSubject<boolean>,
      ) => void,
    },
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    this.longTermGoalsForm = [
      { 
        __id: this.data.longTermData.longTermGoals[0].__id,
        year: 'one',
        text: this.data.longTermData.longTermGoals[0].oneYear,
      },
      { 
        __id: this.data.longTermData.longTermGoals[0].__id,
        year: 'five',
        text: this.data.longTermData.longTermGoals[0].fiveYear,
      },
    ];
  }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------

  /** Drop event for drag-and-drop functionality */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.longTermGoalsForm, event.previousIndex, event.currentIndex);
  }

  /** Close the modal. */
  close() { 
    this.dialogRef.close();
  }

  /** Submit the project data. */
  submit() { 
    this.data.updateGoals(this.longTermGoalsForm, this.loading$);
  }


  // --------------- OTHER -------------------------------
}
