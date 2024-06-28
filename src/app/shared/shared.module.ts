import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

// External Modules
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Containers

// Components

// Pipes

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    // External Modules
    MatSnackBarModule,
  ],
  declarations: [
    // Containers
    // Components
    // Pipes
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule,
    // External Modules
    MatSnackBarModule,
    // Containers
    // Components
    // Pipes
  ],
})
export class SharedModule { }
