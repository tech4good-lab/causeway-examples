import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';
import { QuarterData } from '../+state/page.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The quarter and its associated goals. */
  @Input() quarterData: QuarterData = {
    __id: '1664607600000',
    startTime: 1664607600000,
    endTime: 1672559999999,
    quarterGoals: [
      {
        __id: 'qg1',
        __quarterId: '1664607600000',
        __userId: 'test-user',
        text: 'Finish cover letters',
        completed: false,
        order: 1,
      },
      {
        __id: 'qg2',
        __quarterId: '1664607600000',
        __userId: 'test-user',
        text: 'Apply to internships',
        completed: false,
        order: 2,
      },
      {
        __id: 'qg1',
        __quarterId: '1664607600000',
        __userId: 'test-user',
        text: 'Technical interview prep!',
        completed: false,
        order: 3,
      },
    ],
  };

  /** Initiate edit of quarterly goals. */
  @Output() editGoals: EventEmitter<void> = new EventEmitter<void>();

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  /** get the term for the quarter. */
  getTerm() {
    const date = new Date(this.quarterData.startTime);
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

  // --------------- EVENT BINDING -----------------------

  /** Function for emitting an edit goals event */
  edit() {
    this.editGoals.emit()
  }

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor() { }

  ngOnInit(): void {
  }
}
