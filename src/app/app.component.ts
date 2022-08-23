import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from './core/store/app.reducer';
import { LoadAuth } from './core/store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<fromStore.State>,
  ) {
  }

  ngOnInit() {
    // Load auth into store    
    this.store.dispatch( new LoadAuth() );
  }
}
