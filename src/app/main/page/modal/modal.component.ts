import { Component, OnInit, ChangeDetectionStrategy, input, output, signal, computed, inject, WritableSignal, Signal } from '@angular/core';
import { ModalAnimations } from './modal.animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: ModalAnimations,
})
export class ModalComponent implements OnInit {
  
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- HELPERS AND SETUP -------------------

  constructor(
  ) {
  }

  ngOnInit(): void {
  }
}
