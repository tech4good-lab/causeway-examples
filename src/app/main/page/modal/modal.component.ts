import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuarterData, QuarterGoalInForm } from '../+state/page.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      quarterData: QuarterData,
      updateGoals: (
        goals: [QuarterGoalInForm, QuarterGoalInForm, QuarterGoalInForm],
        loading$: BehaviorSubject<boolean>,
      ) => void,
    },
    private dialogRef: MatDialogRef<ModalComponent>,
  ) { }

  ngOnInit(): void {
  }
}
