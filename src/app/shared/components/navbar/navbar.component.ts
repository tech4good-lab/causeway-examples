import { Component, OnInit, Signal } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { User } from 'src/app/core/store/user/user.model';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatMenuTrigger, MatMenu],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

  samepleUserData : User = {
    __id: 'test-user',
    name: 'Test User',
    email: 'test@sample.com',
    photoURL: 'http://placekitten.com/100/100',
  }

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
