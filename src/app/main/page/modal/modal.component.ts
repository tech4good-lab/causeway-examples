import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Inject } from '@angular/core';
import { ModalAnimations } from './modal.animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { QuarterlyGoalInForm, QuarterlyGoalData } from '../page.model';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { getStartAndEndDate, getQuarterAndYear } from 'src/app/core/utils/time.utils';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  /** FormControls for editing past goals and adding a new one */
  quarterGoalsForm: FormGroup;
  
  /** Getter for the form array with a type that allows use of controls. */
  get allGoals() {
    return this.quarterGoalsForm.get('allGoals') as FormArray;
  }

  // --------------- COMPUTED DATA -----------------------

  getQuarterAndYear = getQuarterAndYear; // import from time.utils.ts

  // --------------- EVENT HANDLING ----------------------

  /** Add a goal to the form. */
  addGoalToForm(goal: QuarterlyGoalInForm) {
    if (goal) {
      this.allGoals.push(this.fb.group({
        text: [goal.text, Validators.required],
        hashtagName: [goal.hashtagName],
        originalText: [goal.text],
        originalOrder: [goal.originalOrder],
        originalHashtagName: [goal.hashtagName],
        __quarterlyGoalId: [goal.__quarterlyGoalId],
        __hashtagId: [goal.__hashtagId, Validators.required],
        endDate: [getStartAndEndDate()[1]],
        _deleted: [goal._deleted],
      }));
    } else {
      this.allGoals.push(this.fb.group({
        text: ['', Validators.required],
        hashtagName: ['', Validators.required],
        _deleted: [false],
      }));
    }
  }

  /** Save any updates for any of the goals. */
  saveGoals() {
    this.data.updateQuarterlyGoals(this.allGoals);
  }


  /** Support drag and drop of goals. */
  drop(event: CdkDragDrop<QuarterlyGoal[]>) {
    // update the form accordingly
    this.moveItemInFormArray(this.allGoals, event.previousIndex, event.currentIndex);
  }

  /**
   * Moves an item in a FormArray to another position.
   * @param formArray FormArray instance in which to move the item.
   * @param fromIndex Starting index of the item.
   * @param toIndex Index to which the item should be moved.
   * https://stackoverflow.com/questions/56149461/draggable-formgroups-in-formarray-reactive-forms
   */
  moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const dir = toIndex > fromIndex ? 1 : -1;

    const from = fromIndex;
    const to = toIndex;

    const temp = formArray.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(to, temp);
  }


  // --------------- OTHER -------------------------------


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      incompleteGoals: QuarterlyGoalData[],
      updateQuarterlyGoals: (quarterGoalsFormArray: FormArray) => void,
    },
    public dialogRef: MatDialogRef<ModalComponent>,
    private fb: FormBuilder,
  ) {
    // Initialize the quarterGoalsForm with the set of incompleteGoals
    this.quarterGoalsForm = this.fb.group({
      allGoals: this.fb.array([
        this.fb.group({
          text: ['', Validators.required],
          hashtagName: ['', Validators.required],
          originalText: [''],
          originalOrder: [1],
          originalHashtagName: [''],
          __quarterlyGoalId: [''],
          __hashtagId: [''],
          _deleted: [false],
        }),
      ]),
    });

    this.allGoals.clear();
    this.data.incompleteGoals.forEach((goal) => {
      this.addGoalToForm({
        text: goal.text,
        hashtagName: goal.hashtag?.name,
        originalText: goal.text,
        originalOrder: goal.order,
        originalHashtagName: goal.hashtag?.name,
        __quarterlyGoalId: goal.__id,
        __hashtagId: goal.hashtag?.__id,
        _deleted: goal._deleted,
      });
    });
  }

  ngOnInit(): void {
  }
}
