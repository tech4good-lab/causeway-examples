import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { ModalAnimations } from './modal.animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  // --------------- INPUTS AND OUTPUTS ---------


  // --------------- LOCAL UI STATE ----------------------


  constructor() { }

  ngOnInit(): void {
  }

  // --------------- DATA BINDING FUNCTIONS ----------------


  // --------------- EVENT BINDING FUNCTIONS ---------------


  // --------------- OTHER -------------------------------
}
