import { Component, inject, OnInit, Signal } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { User } from 'src/app/core/store/user/user.model';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatMenuTrigger, MatMenu],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  
  // --------------- OTHER -------------------------------

  constructor(
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  ngOnInit(): void {
  }
}
