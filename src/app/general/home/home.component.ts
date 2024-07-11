import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeAnimations } from './home.animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: HomeAnimations,
  standalone: true,
  imports: [],
})
export class HomeComponent {

}