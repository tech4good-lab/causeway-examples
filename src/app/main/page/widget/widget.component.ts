import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';
import { LongTermData } from '../+state/page.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ---------

  /** The long term goals for this user. */
  //@Input() longTermData: LongTermGoal;
  @Input() longTermData: LongTermData;

  /** Initiate edit of long term goals. */
  @Output() editGoals: EventEmitter<void> = new EventEmitter<void>();

  // --------------- LOCAL UI STATE ----------------------

  constructor() { }

  ngOnInit(): void {
  }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------

  /** Function for emitting an edit goals event */
  edit() {
    this.editGoals.emit()
  }

  // --------------- OTHER -------------------------------

}
