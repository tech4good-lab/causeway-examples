import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeAnimations } from './home.animations';
import { NavbarComponent } from 'src/app/shared/components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: HomeAnimations,
  standalone: true,
  imports: [ NavbarComponent],
})
export class HomeComponent {

}