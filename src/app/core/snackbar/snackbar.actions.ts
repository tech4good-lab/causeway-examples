import { Action } from '@ngrx/store';
import { MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';

export enum SnackbarActionTypes {
  SHOW_MESSAGE = '[Snackbar] show snackbar message',
} 

/** If there is a component, will use openFromComponent. Otherwise, will use message. At least one of component or message needs to be provided. */                    
export class ShowSnackbar implements Action {
  readonly type = SnackbarActionTypes.SHOW_MESSAGE;
  constructor(
    public payload: {          
      component?: any,         
      message?: string,        
      action?: string,         
      config?: MatSnackBarConfig<any>,
      onAction?: (snackBarRef: MatSnackBarRef<any>) => any,
    },
    public correlationId?: string,  
  ) {}
}

export type SnackbarActions =  
  ShowSnackbar;
