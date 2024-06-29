import { Component, OnInit, inject } from '@angular/core';
import { MockDBService } from './core/firebase/mock-db.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private mockDB: MockDBService,
  ) { }

  ngOnInit() {
    this.mockDB.initDB();
  }
}
