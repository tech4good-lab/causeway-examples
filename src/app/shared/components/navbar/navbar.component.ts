import { Component, OnInit } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ MatMenuTrigger, MatMenu],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  // --------------- INPUTS AND OUTPUTS ------------------

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
