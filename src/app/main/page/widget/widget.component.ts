import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';
import { OnboardingState } from '../../../core/store/user/user.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The user. */
  @Input() state: OnboardingState = OnboardingState.WELCOME;

  // --------------- LOCAL AND GLOBAL STATE --------------

  // --------------- DATA BINDING ------------------------

  // --------------- EVENT BINDING -----------------------

  // --------------- HELPER FUNCTIONS AND OTHER ----------

  constructor() { }

  ngOnInit(): void {
  }
}
