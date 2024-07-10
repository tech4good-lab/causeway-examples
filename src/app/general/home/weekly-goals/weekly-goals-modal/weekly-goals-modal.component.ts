import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
  ],
})
export class WeeklyGoalsModalComponent {

}
