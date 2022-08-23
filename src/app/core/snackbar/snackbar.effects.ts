import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { tap, take } from 'rxjs/operators';
import { SnackbarActionTypes, ShowSnackbar } from './snackbar.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()                  
export class SnackbarEffects {
  
  /** Process the snackbar action. */
  showSnackbar$: Observable<Action> = createEffect(
    () => this.actions$.pipe(
      ofType<ShowSnackbar>(SnackbarActionTypes.SHOW_MESSAGE),
      tap((action: ShowSnackbar) => {
        
        let snackBarRef;
        const config = action.payload.config;
      
        if (action.payload.component) {
          snackBarRef = this.snackBar.openFromComponent(action.payload.component, config);
        } else if (action.payload.message) {
          snackBarRef = this.snackBar.open(action.payload.message, action.payload.action || '', config);
        }
    
        if (action.payload.onAction) {
          snackBarRef.onAction().pipe(take(1)).subscribe(() => {
            action.payload.onAction(snackBarRef);
            snackBarRef.dismiss();
          });
        }
      }),
    ), { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
  ) {} 
}
