import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuarterData, QuarterGoalInForm } from '../+state/page.model';
import { BehaviorSubject } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
  quarterGoalsForm: [QuarterGoalInForm, QuarterGoalInForm];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      quarterData: QuarterData,
      updateGoals: (
        goals: [QuarterGoalInForm, QuarterGoalInForm],
        loading$: BehaviorSubject<boolean>,
      ) => void,
    },
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
    this.quarterGoalsForm = [
      { 
        __id: this.data.quarterData.quarterGoals[0].__id,
        text: this.data.quarterData.quarterGoals[0].text,
      },
      { 
        __id: this.data.quarterData.quarterGoals[1].__id,
        text: this.data.quarterData.quarterGoals[1].text,
      },
    ];
  }

  // --------------- DATA BINDING FUNCTIONS ----------------

  /** get the term for the quarter. */
  getTerm() {
    const date = new Date(this.data.quarterData.startTime);
    const month = date.getMonth();
    if (month <= 2) {
      return 'Winter';
    } else if (month <= 5) {
      return 'Spring';
    } else if (month <= 8) {
      return 'Summer';
    } else {
      return 'Fall';
    }
  }

  // --------------- EVENT BINDING FUNCTIONS ---------------

  /** Drop event for drag-and-drop functionality */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.quarterGoalsForm, event.previousIndex, event.currentIndex);
  }

  /** Close the modal. */
  close() { 
    this.dialogRef.close();
  }

  /** Submit the project data. */
  submit() { 
    this.data.updateGoals(this.quarterGoalsForm, this.loading$);
  }

  // --------------- OTHER -------------------------------
}
