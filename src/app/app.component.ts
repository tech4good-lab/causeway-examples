import { Component, OnInit, inject } from '@angular/core';
import { AuthStore } from './core/store/auth/auth.store';
import { MockDBService } from './core/firebase/mock-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  constructor(
    private mockDB: MockDBService,
  ) { }

  ngOnInit() {
    this.mockDB.initDB();
  }
}
