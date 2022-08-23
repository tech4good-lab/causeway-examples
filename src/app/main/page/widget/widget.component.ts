import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** Raw time in milliseconds from 1970/01/01 00:00:00:000 **/
  @Input() time: number = 1661232134699;

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  /** Get day suffix. */
  daySuffix() {
    const date = new Date(this.time);
    const day = date.getDate();
    if (day === 1 || day === 21 || day === 31) {
      return 'st';
    } else if (day === 2 || day === 22) {
      return 'nd';
    } else if (day === 3 || day === 23) {
      return 'rd';
    } else {
      return 'th';
    }
  }

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor() { }

  ngOnInit(): void {
  }
}
