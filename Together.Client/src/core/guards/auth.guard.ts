import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { authAuthenticatedSelector } from '~features/feature-auth/store';
import { Observable, tap } from 'rxjs';
import { CommonService } from '~shared/services';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const store = inject(Store);
  const commonService = inject(CommonService);

  return store.select(authAuthenticatedSelector).pipe(
    tap((val) => {
      if (!val) {
        commonService.redirectToLogin();
      }
    }),
  );
};
