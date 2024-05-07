import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonService } from '~shared/services';
import { authAuthenticatedSelector } from '~features/feature-auth/store';
import { map, Observable, tap } from 'rxjs';

export const loggedGuard: CanActivateFn = (
  route,
  state,
): Observable<boolean> => {
  const store = inject(Store);
  const commonService = inject(CommonService);

  return store.select(authAuthenticatedSelector).pipe(
    map((val) => !val),
    tap((val) => {
      if (!val) {
        commonService.redirectToMain();
      }
    }),
  );
};
