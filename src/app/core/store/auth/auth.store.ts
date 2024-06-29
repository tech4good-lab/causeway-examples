import { inject, InjectionToken, effect, Injector } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User, AccessState } from '../user/user.model';
import { FirebaseService } from '../../firebase/firebase.service';
import { firstValueFrom, EMPTY, of, pipe } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { USER_1 } from '../../firebase/mock-db.service';

type State = {
  user: User;
  isLoadingLogin: boolean;
}

const initialState: State = {
  user: USER_1, // start logged in
  isLoadingLogin: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, db = inject(FirebaseService), router = inject(Router)) => ({
    async login(provider: string, params: {
      scope?: string,
      doNotRoute: boolean
    } = { doNotRoute: false }): Promise<void> {
      db.login(provider);
      if (!params || !params.doNotRoute) {
        router.navigate(['/page']);
      }
    },
    async logout(params?: { doNotRoute: boolean }): Promise<void> {
      db.logout();
    },
  })),
);
