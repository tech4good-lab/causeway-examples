import { ChangeDetectionStrategy, Component, OnInit, input, signal, computed, inject, WritableSignal, Signal, effect } from '@angular/core';
import { PageAnimations } from './page.animations';
import { QuarterlyGoalStore } from '../../core/store/quarterly-goal/quarterly-goal.store';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: PageAnimations,
})
export class PageComponent implements OnInit {
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- HELPERS AND SETUP --------------------------

  constructor(
  ) {
    effect(() => {
      console.log('Quarterly Goal', this.quarterlyGoalStore.entities());
    });
  }

  ngOnInit(): void { 
  }
}
