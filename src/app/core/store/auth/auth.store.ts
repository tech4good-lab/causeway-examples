import { inject, effect, Injector } from '@angular/core';
import { signalStore, patchState, withState, withMethods } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { User, AccessState } from '../user/user.model';
import { FirebaseService } from '../../firebase/firebase.service';
import { firstValueFrom, EMPTY, of, pipe } from 'rxjs';
import { tap, catchError, switchMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';

type State = {
  user: User;
  isLoadingLogin: boolean;
}

const initialState: State = {
  user: null,
  isLoadingLogin: false,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, db = inject(FirebaseService), router = inject(Router)) => ({
    loadAuth: rxMethod<void>(
      pipe(
        // Every time firebase or db user changes, we want to update auth store
        switchMap(() => db.afUser()),
        tap((dbUser: User) => {
          if (!dbUser) {
            patchState(store, { user: undefined });
          } else {
            patchState(store, { user: dbUser });
          }
        }),
      ),
    ),
    async login(provider: string, params: {
      scope?: string,
      doNotRoute: boolean
    } = { doNotRoute: false }): Promise<void> {
      patchState(store, { isLoadingLogin: true });

      try {
        const loginResult = await db.login(provider, params.scope);
        const afUser = loginResult.user;
        // could this be problematic if it hits a cached value?
        const dbUser: User = await db.getEntity('users', afUser.uid);

        const navLocation = ['/home'];
        // update the token if there is already a dbUser
        if (dbUser) {
          const tokenHash = {};
          tokenHash[provider] = afUser.accessToken;
          const changes = {
            email: afUser.email,
            name: afUser.displayName || afUser.email,
            photoURL: afUser.photoURL,
            tokens: Object.assign({}, dbUser.tokens || {}, tokenHash),
          };
          try {
            patchState(store, { user: dbUser });
            await db.updateEntity('users', dbUser.__id, changes);

            if (!params || !params.doNotRoute) {
              router.navigate(navLocation, { queryParamsHandling: 'preserve' });
            }
          } catch (e) {
            console.error(e);
            throw e;
          }
        } else {
          const tokenHash = {};
          tokenHash[provider] = afUser.accessToken;
          const newUser = {
            __id: afUser.uid,
            email: afUser.email,
            name: afUser.displayName || afUser.email,
            photoURL: afUser.photoURL,
            tokens: tokenHash,
            isAdmin: false,
            consented: false,
            accessState: AccessState.CONSENT,
          };
          try {
            await db.addEntity('users', newUser);
            patchState(store, { user: newUser });

            if (!params || !params.doNotRoute) {
              router.navigate(navLocation, { queryParamsHandling: 'preserve' });
            }
          } catch (e) {
            console.error(e);
            throw e;
          }
        }
      } catch (e) {
        switch (e.code) {
          case 'auth/account-exists-with-different-credential': {
            db.loginLink(e);
          }
        }
        throw e;
      }
      patchState(store, { isLoadingLogin: false });
    },
    async logout(params?: { doNotRoute: boolean }): Promise<void> {
      try {
        await db.logout();
        if (!params || !params.doNotRoute) {
          router.navigate(['/landing']);
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    },
  })),
);
