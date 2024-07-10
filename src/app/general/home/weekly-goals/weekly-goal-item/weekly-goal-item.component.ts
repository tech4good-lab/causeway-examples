import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeeklyGoalItemAnimations } from './weekly-goal-item.animations';

@Component({
  selector: 'app-weekly-goal-item',
  templateUrl: './weekly-goal-item.component.html',
  styleUrls: ['./weekly-goal-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [WeeklyGoalItemAnimations],
  imports: [],
  standalone: true,
})
export class WeeklyGoalItemComponent {

}
