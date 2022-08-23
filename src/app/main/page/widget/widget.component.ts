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

  // --------------- INPUTS AND OUTPUTS ---------

  // --------------- LOCAL UI STATE ----------------------

  constructor() { }

  ngOnInit(): void {
  }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------


  // --------------- OTHER -------------------------------

}
