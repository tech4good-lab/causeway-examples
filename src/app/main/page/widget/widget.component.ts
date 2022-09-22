import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { WidgetAnimations } from './widget.animations';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WidgetAnimations,
})
export class WidgetComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ---------

  /** The long term goal. */
  @Input() longTermGoal: LongTermGoal = {
    __id: 'ltg',
    __userId: 'test-user',
    oneYear: 'Improve my grades',
    fiveYear: 'Land a well paying job that I enjoy',
  };
    
  /** Initiate edit of long term goals. */
  @Output() editGoals: EventEmitter<void> = new EventEmitter<void>();
  
  // --------------- LOCAL UI STATE ----------------------

  constructor() { }

  ngOnInit(): void {
    console.log(this.longTermGoal);
  }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------

  openEditor () {
    console.log("Open editor");
    document.getElementById('edit-popup').style.display = 'block';
  }

  closeEditor () {
    console.log("Close editor");
    document.getElementById('edit-popup').style.display = 'none';
  }


  // --------------- OTHER -------------------------------

}
