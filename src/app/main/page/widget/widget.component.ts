import { Component, OnInit, ChangeDetectionStrategy, input, signal, computed, inject, WritableSignal, Signal } from '@angular/core';
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

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- HELPERS AND SETUP -------------------

  constructor(
  ) {
  }

  ngOnInit(): void {
  }
}
