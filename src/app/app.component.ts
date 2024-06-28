import { Component, OnInit, inject } from '@angular/core';
import { AuthStore } from './core/store/auth/auth.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  constructor() { }

  ngOnInit() {
    // Load auth into store    
    this.authStore.loadAuth();
  }
}
