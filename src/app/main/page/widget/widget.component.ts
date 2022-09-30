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

  // --------------- INPUTS AND OUTPUTS ---------

  /** The quarter and its associated goals. */
  @Input() quarterData: QuarterData;
 
  /** Initiate edit of quarterly goals. */
  @Output() editGoals: EventEmitter<void> = new EventEmitter<void>();

  // --------------- LOCAL UI STATE ----------------------

  constructor() { }

  ngOnInit(): void {
  }

  // --------------- DATA BINDING FUNCTIONS ----------------

  /** get the term for the quarter. */


  // --------------- EVENT BINDING FUNCTIONS ---------------

  /** Function for emitting an edit goals event */
  edit() {
    this.editGoals.emit()
  }

  // --------------- OTHER -------------------------------

}


