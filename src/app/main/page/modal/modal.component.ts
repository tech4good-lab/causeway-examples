import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LongTermData, LongTermGoalsInForm } from '../+state/page.model';
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
  longTermGoalsForm: [LongTermGoalsInForm, LongTermGoalsInForm];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
       //longTermData: LongTermData,
      longTermGoals: LongTermGoal[],  // Or use top one
      updateGoals: (
        //goals: [LongTermGoalInForm, LongTermGoalInForm,LongTermGoalInForm],
        goals: [LongTermGoalsInForm, LongTermGoalsInForm],
        loading$: BehaviorSubject<boolean>,
      ) => void,
    },
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    this.longTermGoalsForm = [
      { 
        //__id: this.data.quarterData.quarterGoals[0].__id,
        //text: this.data.quarterData.quarterGoals[0].text,
        __id: this.data.longTermGoals[0].__id,
        text: this.data.longTermGoals[0].oneYear,
      },
      { 
        __id: this.data.longTermGoals[0].__id,
        text: this.data.longTermGoals[0].fiveYear,
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
